import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders search bar with default values', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    expect(screen.getByText('Check in')).toBeInTheDocument();
    expect(screen.getByText('Check out')).toBeInTheDocument();
    expect(screen.getByText('1 guest')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('opens location modal when location button is clicked', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const locationButton = screen.getByText('Anywhere');
    fireEvent.click(locationButton);
    
    await waitFor(() => {
      expect(screen.getByText('Where to?')).toBeInTheDocument();
    });
  });

  test('opens date modal when check-in button is clicked', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const checkInButton = screen.getByText('Check in');
    fireEvent.click(checkInButton);
    
    await waitFor(() => {
      expect(screen.getByText('When\'s your trip?')).toBeInTheDocument();
    });
  });

  test('opens guests modal when guests button is clicked', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const guestsButton = screen.getByText('1 guest');
    fireEvent.click(guestsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Who\'s coming?')).toBeInTheDocument();
    });
  });

  test('updates guest count correctly', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    // Open guests modal
    const guestsButton = screen.getByText('1 guest');
    await user.click(guestsButton);
    
    // Find and click increment button for adults
    const adultsPlusButton = screen.getAllByRole('button', { name: '+' })[0];
    await user.click(adultsPlusButton);
    
    // Check if count updated
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Close modal and check if guest count updated
    const doneButton = screen.getByRole('button', { name: /done/i });
    await user.click(doneButton);
    
    expect(screen.getByText('2 guests')).toBeInTheDocument();
  });

  test('decrements guest count correctly', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    // Open guests modal
    const guestsButton = screen.getByText('1 guest');
    await user.click(guestsButton);
    
    // Add a guest first
    const adultsPlusButton = screen.getAllByRole('button', { name: '+' })[0];
    await user.click(adultsPlusButton);
    
    // Then decrement
    const adultsMinusButton = screen.getAllByRole('button', { name: '-' })[0];
    await user.click(adultsMinusButton);
    
    // Should be back to 1
    const doneButton = screen.getByRole('button', { name: /done/i });
    await user.click(doneButton);
    
    expect(screen.getByText('1 guest')).toBeInTheDocument();
  });

  test('prevents adults count from going below 1', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const guestsButton = screen.getByText('1 guest');
    await user.click(guestsButton);
    
    // Try to decrement below 1
    const adultsMinusButton = screen.getAllByRole('button', { name: '-' })[0];
    await user.click(adultsMinusButton);
    
    // Should still be 1
    const doneButton = screen.getByRole('button', { name: /done/i });
    await user.click(doneButton);
    
    expect(screen.getByText('1 guest')).toBeInTheDocument();
  });

  test('handles search submission', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith({
      location: '',
      checkIn: null,
      checkOut: null,
      guests: { adults: 1, children: 0, infants: 0 },
    });
  });

  test('closes modal when backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    // Open location modal
    const locationButton = screen.getByText('Anywhere');
    await user.click(locationButton);
    
    await waitFor(() => {
      expect(screen.getByText('Where to?')).toBeInTheDocument();
    });
    
    // Click backdrop to close
    const backdrop = screen.getByTestId('modal-backdrop');
    await user.click(backdrop);
    
    await waitFor(() => {
      expect(screen.queryByText('Where to?')).not.toBeInTheDocument();
    });
  });

  test('displays correct guest text for multiple guest types', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const guestsButton = screen.getByText('1 guest');
    await user.click(guestsButton);
    
    // Add children and infants
    const childrenPlusButton = screen.getAllByRole('button', { name: '+' })[1];
    const infantsPlusButton = screen.getAllByRole('button', { name: '+' })[2];
    
    await user.click(childrenPlusButton);
    await user.click(infantsPlusButton);
    
    const doneButton = screen.getByRole('button', { name: /done/i });
    await user.click(doneButton);
    
    expect(screen.getByText('3 guests')).toBeInTheDocument();
  });
}); 