import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { BookingPage } from '../pages/BookingPage';

// Mock Supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: {
              id: 1,
              name: 'Ocean View Suite',
              price_per_night: 150,
              images: ['test-image.jpg'],
              amenities: ['WiFi', 'Pool'],
            },
            error: null,
          })),
        })),
      })),
    })),
    auth: {
      getUser: jest.fn(() => Promise.resolve({
        data: {
          user: {
            id: 'test-user',
            email: 'test@example.com',
            user_metadata: { firstName: 'John', lastName: 'Doe' },
          },
        },
        error: null,
      })),
    },
  },
}));

// Mock Stripe
jest.mock('../lib/stripe', () => ({
  stripe: {
    elements: jest.fn(() => ({
      create: jest.fn(() => ({
        mount: jest.fn(),
        on: jest.fn(),
        unmount: jest.fn(),
      })),
    })),
    createPaymentMethod: jest.fn(() => Promise.resolve({
      paymentMethod: { id: 'pm_test' },
      error: null,
    })),
  },
  Elements: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardElement: () => <div data-testid="card-element">Card Element</div>,
}));

// Mock router params
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ roomId: '1' }),
  useSearchParams: () => [
    new URLSearchParams('checkIn=2024-01-15&checkOut=2024-01-18&guests=2'),
  ],
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Booking Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays booking information correctly', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <BookingPage />
      </Wrapper>
    );

    // Wait for room data to load
    await waitFor(() => {
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument();
    });

    // Check trip details
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jan 18, 2024')).toBeInTheDocument();
    expect(screen.getByText('2 guests')).toBeInTheDocument();
  });

  test('calculates total price correctly', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <BookingPage />
      </Wrapper>
    );

    await waitFor(() => {
      // 3 nights × $150 = $450
      expect(screen.getByText('$450.00')).toBeInTheDocument();
      // Service fee (10%)
      expect(screen.getByText('$45.00')).toBeInTheDocument();
      // Total with fees
      expect(screen.getByText('$495.00')).toBeInTheDocument();
    });
  });

  test('validates required guest information', async () => {
    const user = userEvent.setup();
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <BookingPage />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument();
    });

    // Try to book without filling required fields
    const confirmButton = screen.getByRole('button', { name: /confirm and pay/i });
    await user.click(confirmButton);

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
    });
  });

  test('allows filling guest information form', async () => {
    const user = userEvent.setup();
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <BookingPage />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument();
    });

    // Fill guest information
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');

    // Check if values are set
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();
  });

  test('shows payment section when guest info is valid', async () => {
    const user = userEvent.setup();
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <BookingPage />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument();
    });

    // Fill all required fields
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');

    // Payment section should be visible
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    expect(screen.getByTestId('card-element')).toBeInTheDocument();
  });

  test('handles cancellation policy display', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <BookingPage />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument();
    });

    // Check cancellation policy
    expect(screen.getByText(/free cancellation/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel before/i)).toBeInTheDocument();
  });

  test('displays ground rules and policies', async () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <BookingPage />
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Ocean View Suite')).toBeInTheDocument();
    });

    // Check ground rules
    expect(screen.getByText('Ground rules')).toBeInTheDocument();
    expect(screen.getByText(/check-in after 3:00 pm/i)).toBeInTheDocument();
    expect(screen.getByText(/checkout before 11:00 am/i)).toBeInTheDocument();
    expect(screen.getByText(/maximum 2 guests/i)).toBeInTheDocument();
  });
}); 