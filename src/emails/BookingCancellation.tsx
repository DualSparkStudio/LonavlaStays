import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface BookingCancellationEmailProps {
  bookingId: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  refundAmount: number;
  cancellationFee: number;
}

export const BookingCancellationEmail = ({
  bookingId = 'BK123456',
  guestName = 'John Doe',
  roomName = 'Ocean View Suite',
  checkIn = '2024-01-15',
  checkOut = '2024-01-18',
  refundAmount = 135.00,
  cancellationFee = 15.00,
}: BookingCancellationEmailProps) => {
  const previewText = `Your booking ${bookingId} has been cancelled`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container>
          <Section style={logo}>
            <Heading style={heading}>Resort Booking</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Booking Cancelled</Heading>
            <Text style={paragraph}>Hi {guestName},</Text>
            <Text style={paragraph}>
              We've processed your cancellation request. Your booking has been successfully cancelled.
            </Text>

            <Section style={bookingDetails}>
              <Heading style={h2}>Cancelled Booking Details</Heading>
              <Text style={detailItem}>
                <strong>Booking ID:</strong> {bookingId}
              </Text>
              <Text style={detailItem}>
                <strong>Room:</strong> {roomName}
              </Text>
              <Text style={detailItem}>
                <strong>Check-in:</strong> {new Date(checkIn).toLocaleDateString()}
              </Text>
              <Text style={detailItem}>
                <strong>Check-out:</strong> {new Date(checkOut).toLocaleDateString()}
              </Text>
            </Section>

            <Section style={refundDetails}>
              <Heading style={h2}>Refund Information</Heading>
              <Text style={detailItem}>
                <strong>Refund Amount:</strong> ${refundAmount.toFixed(2)}
              </Text>
              <Text style={detailItem}>
                <strong>Cancellation Fee:</strong> ${cancellationFee.toFixed(2)}
              </Text>
              <Text style={refundNote}>
                Your refund will be processed within 3-5 business days and will appear on your original payment method.
              </Text>
            </Section>

            <Section style={contact}>
              <Heading style={h2}>Need Help?</Heading>
              <Text style={paragraph}>
                If you have any questions about your cancellation or refund, 
                please contact us at support@resortbooking.com or call (555) 123-4567.
              </Text>
            </Section>

            <Text style={paragraph}>
              We're sorry to see you go and hope to welcome you back in the future.<br />
              The Resort Booking Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingCancellationEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const logo = {
  padding: '20px 0',
  borderBottom: '1px solid #e6e6e6',
  textAlign: 'center' as const,
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#FF385C',
  margin: 0,
};

const content = {
  padding: '20px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0 20px',
};

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
};

const paragraph = {
  color: '#666',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

const bookingDetails = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #e6e6e6',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const refundDetails = {
  backgroundColor: '#f0f8ff',
  border: '1px solid #cce7ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const detailItem = {
  color: '#333',
  fontSize: '14px',
  margin: '5px 0',
};

const refundNote = {
  color: '#666',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '15px 0 5px',
};

const contact = {
  backgroundColor: '#fff5f5',
  border: '1px solid #fed7d7',
  borderRadius: '8px',
  padding: '15px',
  margin: '20px 0',
}; 