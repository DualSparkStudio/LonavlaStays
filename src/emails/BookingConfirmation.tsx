import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface BookingConfirmationEmailProps {
  bookingId: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  roomImage: string;
}

export const BookingConfirmationEmail = ({
  bookingId = 'BK123456',
  guestName = 'John Doe',
  roomName = 'Ocean View Suite',
  checkIn = '2024-01-15',
  checkOut = '2024-01-18',
  guests = 2,
  totalPrice = 450.00,
  roomImage = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
}: BookingConfirmationEmailProps) => {
  const previewText = `Your booking ${bookingId} has been confirmed!`;

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
            <Heading style={h1}>Booking Confirmed! 🎉</Heading>
            <Text style={paragraph}>Hi {guestName},</Text>
            <Text style={paragraph}>
              Great news! Your booking has been confirmed. We're excited to welcome you to our resort.
            </Text>

            <Section style={bookingDetails}>
              <Heading style={h2}>Booking Details</Heading>
              
              <Row>
                <Column style={imageColumn}>
                  <Img
                    src={roomImage}
                    width="200"
                    height="150"
                    alt={roomName}
                    style={roomImageStyle}
                  />
                </Column>
                <Column style={detailsColumn}>
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
                  <Text style={detailItem}>
                    <strong>Guests:</strong> {guests}
                  </Text>
                  <Text style={detailItem}>
                    <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={checkInInfo}>
              <Heading style={h2}>Check-in Information</Heading>
              <Text style={paragraph}>
                • Check-in time: 3:00 PM<br />
                • Check-out time: 11:00 AM<br />
                • Front desk: Available 24/7<br />
                • Please bring a valid ID for check-in
              </Text>
            </Section>

            <Section style={contact}>
              <Heading style={h2}>Need Help?</Heading>
              <Text style={paragraph}>
                If you have any questions or need to make changes to your booking, 
                please contact us at support@resortbooking.com or call (555) 123-4567.
              </Text>
            </Section>

            <Text style={paragraph}>
              We look forward to hosting you!<br />
              The Resort Booking Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingConfirmationEmail;

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

const imageColumn = {
  width: '200px',
  verticalAlign: 'top' as const,
};

const detailsColumn = {
  paddingLeft: '20px',
  verticalAlign: 'top' as const,
};

const roomImageStyle = {
  borderRadius: '8px',
  objectFit: 'cover' as const,
};

const detailItem = {
  color: '#333',
  fontSize: '14px',
  margin: '5px 0',
};

const checkInInfo = {
  backgroundColor: '#f0f8ff',
  border: '1px solid #cce7ff',
  borderRadius: '8px',
  padding: '15px',
  margin: '20px 0',
};

const contact = {
  backgroundColor: '#fff5f5',
  border: '1px solid #fed7d7',
  borderRadius: '8px',
  padding: '15px',
  margin: '20px 0',
}; 