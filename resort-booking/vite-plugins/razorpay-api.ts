import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Connect } from 'vite';
import type { Plugin } from 'vite';
import { loadEnv } from 'vite';
import { createRazorpayOrder, verifyRazorpaySignature } from '../server/razorpay-handlers';

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => {
      const data = Buffer.concat(chunks).toString('utf8');
      if (!data.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  if (res.writableEnded) return;
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function createApiMiddleware(): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const pathname = req.url?.split('?')[0] ?? '';

    if (pathname === '/api/create-razorpay-order' && req.method === 'POST') {
      try {
        const body = (await readJsonBody(req)) as {
          amountInr?: number;
          receipt?: string;
          notes?: Record<string, string>;
        };
        if (!body.amountInr || body.amountInr <= 0) {
          sendJson(res, 400, { error: 'Invalid amount' });
          return;
        }
        const order = await createRazorpayOrder({
          amountInr: body.amountInr,
          receipt: body.receipt || `booking_${Date.now()}`,
          notes: body.notes,
        });
        sendJson(res, 200, order);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create order';
        sendJson(res, 500, { error: message });
      }
      return;
    }

    if (pathname === '/api/verify-razorpay-payment' && req.method === 'POST') {
      try {
        const body = (await readJsonBody(req)) as {
          orderId?: string;
          paymentId?: string;
          signature?: string;
        };
        if (!body.orderId || !body.paymentId || !body.signature) {
          sendJson(res, 400, { error: 'Missing payment verification fields' });
          return;
        }
        const valid = verifyRazorpaySignature(body.orderId, body.paymentId, body.signature);
        if (!valid) {
          sendJson(res, 400, { error: 'Payment verification failed' });
          return;
        }
        sendJson(res, 200, { success: true, paymentId: body.paymentId });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Verification failed';
        sendJson(res, 500, { error: message });
      }
      return;
    }

    next();
  };
}

/** Dev-only API routes mirroring Netlify functions for `npm run dev`. */
export function razorpayApiPlugin(): Plugin {
  return {
    name: 'razorpay-api-dev',
    enforce: 'pre',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, '');
      Object.assign(process.env, env);

      // Register after Vite internals so this runs before the SPA fallback (avoids empty 404s).
      return () => {
        server.middlewares.use(createApiMiddleware());
      };
    },
  };
}
