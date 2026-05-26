import { Handler } from '@netlify/functions';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { BookingConfirmationEmail } from '../../src/emails/BookingConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { type, data } = JSON.parse(event.body || '{}');

    let emailHtml = '';
    let subject = '';
    let toEmail = '';

    switch (type) {
      case 'booking-confirmation':
        emailHtml = render(BookingConfirmationEmail({
          bookingId: data.bookingId,
          guestName: data.guestName,
          roomName: data.roomName,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          guests: data.guests,
          totalPrice: data.totalPrice,
          roomImage: data.roomImage,
        }));
        subject = `Booking Confirmation - ${data.bookingId}`;
        toEmail = data.guestEmail;
        break;

      case 'booking-cancellation':
        // Simple cancellation email for now
        emailHtml = `
          <h1>Booking Cancelled</h1>
          <p>Dear ${data.guestName},</p>
          <p>Your booking ${data.bookingId} has been cancelled.</p>
          <p>Refund amount: $${data.refundAmount}</p>
          <p>Cancellation fee: $${data.cancellationFee}</p>
          <p>The refund will be processed within 3-5 business days.</p>
          <p>Best regards,<br>Resort Booking Team</p>
        `;
        subject = `Booking Cancellation - ${data.bookingId}`;
        toEmail = data.guestEmail;
        break;

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid email type' }),
        };
    }

    const emailResponse = await resend.emails.send({
      from: 'Resort Booking <noreply@resortbooking.com>',
      to: [toEmail],
      subject,
      html: emailHtml,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        emailId: emailResponse.data?.id,
        message: 'Email sent successfully',
      }),
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to send email',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}; 