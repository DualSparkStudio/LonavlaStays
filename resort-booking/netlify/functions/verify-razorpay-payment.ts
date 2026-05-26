import type { Handler } from '@netlify/functions';
import { verifyRazorpaySignature } from '../../server/razorpay-handlers';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}') as {
      orderId?: string;
      paymentId?: string;
      signature?: string;
    };

    if (!body.orderId || !body.paymentId || !body.signature) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing payment verification fields' }),
      };
    }

    const valid = verifyRazorpaySignature(body.orderId, body.paymentId, body.signature);

    if (!valid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Payment verification failed' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, paymentId: body.paymentId }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verification failed';
    return { statusCode: 500, headers, body: JSON.stringify({ error: message }) };
  }
};
