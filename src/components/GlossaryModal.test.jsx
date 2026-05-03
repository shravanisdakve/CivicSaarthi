import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlossaryModal from './GlossaryModal';

// Mock useTranslation
jest.mock('../hooks/useTranslation', () => ({
  useTranslation: () => ({
    language: 'en',
    t: (key) => key,
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('GlossaryModal', () => {
  const mockTerm = {
    id: 'vvpat',
    term: 'VVPAT',
    fullForm: 'Voter Verifiable Paper Audit Trail',
    definition: 'A system to verify votes.',
    howItWorks: [
      { step: 'Voting', detail: 'User votes on EVM' },
      { step: 'Printing', detail: 'Slip is printed' },
    ],
    whyItMatters: 'Ensures transparency.',
    relatedTerms: ['evm', 'epic'],
  };

  const mockOnClose = jest.fn();
  const mockOnRelatedClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    document.body.style.overflow = 'unset';
  });

  test('does not render when isOpen is false', () => {
    const { container } = render(
      <GlossaryModal isOpen={false} term={mockTerm} onClose={mockOnClose} />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders correctly with term data', () => {
    render(<GlossaryModal isOpen={true} term={mockTerm} onClose={mockOnClose} />);
    
    expect(screen.getByText('VVPAT')).toBeInTheDocument();
    expect(screen.getByText('Voter Verifiable Paper Audit Trail')).toBeInTheDocument();
    expect(screen.getByText('A system to verify votes.')).toBeInTheDocument();
    expect(screen.getByText('Voting')).toBeInTheDocument();
    expect(screen.getByText('User votes on EVM')).toBeInTheDocument();
  });

  test('calls onClose when Escape is pressed', () => {
    render(<GlossaryModal isOpen={true} term={mockTerm} onClose={mockOnClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when close button is clicked', () => {
    render(<GlossaryModal isOpen={true} term={mockTerm} onClose={mockOnClose} />);
    const closeBtn = screen.getByLabelText(/Close/i);
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when footer Close button is clicked', () => {
    render(<GlossaryModal isOpen={true} term={mockTerm} onClose={mockOnClose} />);
    const footerCloseBtn = screen.getByText('Close', { selector: 'button' });
    fireEvent.click(footerCloseBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onRelatedClick when a related term is clicked', () => {
    render(
      <GlossaryModal
        isOpen={true}
        term={mockTerm}
        onClose={mockOnClose}
        onRelatedClick={mockOnRelatedClick}
      />
    );
    const relatedBtn = screen.getByRole('button', { name: /evm/i });
    fireEvent.click(relatedBtn);
    expect(mockOnRelatedClick).toHaveBeenCalledWith('evm');
  });

  test('handles Ask AI form submission and displays response', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ response: 'This is an AI explanation.' }),
    });

    render(<GlossaryModal isOpen={true} term={mockTerm} onClose={mockOnClose} />);
    
    const input = screen.getByPlaceholderText(/Ask anything/i);
    fireEvent.change(input, { target: { value: 'How does it print?' } });
    
    const sendBtn = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendBtn);

    expect(fetch).toHaveBeenCalledWith('/api/chat', expect.any(Object));
    
    await waitFor(() => {
      expect(screen.getByText('This is an AI explanation.')).toBeInTheDocument();
    });
  });

  test('handles AI error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<GlossaryModal isOpen={true} term={mockTerm} onClose={mockOnClose} />);
    
    const input = screen.getByPlaceholderText(/Ask anything/i);
    fireEvent.change(input, { target: { value: 'test question' } });
    
    const sendBtn = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText(/Could not reach CivicSaarthi AI/i)).toBeInTheDocument();
    });
  });
});
