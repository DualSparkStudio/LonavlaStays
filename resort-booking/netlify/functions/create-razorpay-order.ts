import type { Handler } from '@netlify/functions';
import { createRazorpayOrder } from '../../server/razorpay-handlers';

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
      amountInr?: number;
      receipt?: string;
      notes?: Record<string, string>;
    };

    if (!body.amountInr || body.amountInr <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid amount' }),
      };
    }

    const order = await createRazorpayOrder({
      amountInr: body.amountInr,
      receipt: body.receipt || `booking_${Date.now()}`,
      notes: body.notes,
    });

    return { statusCode: 200, headers, body: JSON.stringify(order) };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create order';
    return { statusCode: 500, headers, body: JSON.stringify({ error: message }) };
  }
};
