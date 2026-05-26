import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { booking, paymentMethodId } = JSON.parse(event.body || '{}');

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'https://your-app.netlify.app/bookings',
    });

    if (paymentIntent.status === 'succeeded') {
      // Insert booking into database
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          user_id: booking.userId,
          room_id: booking.roomId,
          check_in: booking.checkIn,
          check_out: booking.checkOut,
          guests: booking.guests,
          total_price: booking.totalPrice,
          status: 'confirmed',
          payment_intent_id: paymentIntent.id,
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          booking: data,
          paymentIntent,
        }),
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Payment failed',
          paymentIntent,
        }),
      };
    }
  } catch (error) {
    console.error('Booking creation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}; 