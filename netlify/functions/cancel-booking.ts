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
    const { bookingId, userId } = JSON.parse(event.body || '{}');

    // Get booking details
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*, payment_intent_id')
      .eq('id', bookingId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !booking) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Booking not found' }),
      };
    }

    // Check if booking can be cancelled (at least 24 hours before check-in)
    const checkInDate = new Date(booking.check_in);
    const now = new Date();
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 24) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Cannot cancel booking less than 24 hours before check-in' 
        }),
      };
    }

    // Process refund with Stripe
    let refundAmount = booking.total_price;
    
    // Apply cancellation fee (10% if more than 7 days, 20% if less)
    const daysUntilCheckIn = hoursUntilCheckIn / 24;
    const cancellationFeePercent = daysUntilCheckIn >= 7 ? 0.1 : 0.2;
    refundAmount = refundAmount * (1 - cancellationFeePercent);

    const refund = await stripe.refunds.create({
      payment_intent: booking.payment_intent_id,
      amount: Math.round(refundAmount * 100), // Convert to cents
      reason: 'requested_by_customer',
    });

    // Update booking status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        refund_amount: refundAmount,
        cancellation_fee: booking.total_price - refundAmount,
      })
      .eq('id', bookingId);

    if (updateError) {
      throw updateError;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        refund,
        refundAmount,
        cancellationFee: booking.total_price - refundAmount,
      }),
    };
  } catch (error) {
    console.error('Booking cancellation error:', error);
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