import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar';
import { MemoryRouter } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { getProfile } from '../utils/profileStorage';
import { useAuth } from '../context/AuthContext';

// Mock dependencies
jest.mock('../hooks/useTranslation');
jest.mock('../utils/profileStorage');
jest.mock('../context/AuthContext');

// Mock child components that might have their own complex logic
jest.mock('./GuestProfileChip', () => {
  const MockGuestProfileChip = () => {
    return <div data-testid="guest-chip">Guest Chip</div>;
  };
  MockGuestProfileChip.displayName = 'MockGuestProfileChip';
  return MockGuestProfileChip;
});
jest.mock('./AuthModal', () => {
  const MockAuthModal = ({ isOpen }) => {
    return isOpen ? <div data-testid="auth-modal">Auth Modal</div> : null;
  };
  MockAuthModal.displayName = 'MockAuthModal';
  return MockAuthModal;
});
jest.mock('./LanguageToggle', () => {
  const MockLanguageToggle = () => {
    return <div data-testid="lang-toggle">Lang Toggle</div>;
  };
  MockLanguageToggle.displayName = 'MockLanguageToggle';
  return MockLanguageToggle;
});

describe('Navbar Component', () => {
  const mockT = jest.fn((key) => key);

  beforeEach(() => {
    jest.clearAllMocks();
    useTranslation.mockReturnValue({ t: mockT });
    getProfile.mockReturnValue({ name: 'Guest Citizen', authProvider: 'none' });
    useAuth.mockReturnValue({ user: null });
    
    // Mock xl screen size for desktop tests
    window.innerWidth = 1280;
    fireEvent(window, new Event('resize'));
  });

  test('renders logo and main links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('CivicSaarthi')).toBeInTheDocument();
    expect(screen.getByText('nav.home')).toBeInTheDocument();
  });

  test('toggles "More" dropdown on click (desktop)', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const moreBtn = screen.getByRole('button', { name: /More/i });
    
    // Initially closed
    expect(screen.queryByText('nav.map')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(moreBtn);
    expect(screen.getByText('nav.map')).toBeInTheDocument();
    expect(moreBtn).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    fireEvent.click(moreBtn);
    expect(screen.queryByText('nav.map')).not.toBeInTheDocument();
    expect(moreBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('opens "More" dropdown on hover (desktop)', async () => {
    jest.useFakeTimers();
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const moreWrapper = screen.getByRole('button', { name: /More/i }).closest('.more-dropdown-wrapper');
    
    // Hover to open
    fireEvent.mouseEnter(moreWrapper);
    expect(screen.getByText('nav.map')).toBeInTheDocument();

    // Leave to close (with timeout)
    fireEvent.mouseLeave(moreWrapper);
    
    // Should still be open before timeout
    expect(screen.getByText('nav.map')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(201);
    });
    
    expect(screen.queryByText('nav.map')).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  test('closes "More" dropdown when a link is clicked', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const moreBtn = screen.getByRole('button', { name: /More/i });
    fireEvent.click(moreBtn);
    
    const mapLink = screen.getByText('nav.map');
    fireEvent.click(mapLink);
    
    expect(screen.queryByText('nav.map')).not.toBeInTheDocument();
  });

  test('toggles mobile menu on hamburger click', () => {
    // Set mobile viewport
    window.innerWidth = 375;
    fireEvent(window, new Event('resize'));

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const menuBtn = screen.getByLabelText('Toggle menu');
    
    // Initially closed
    expect(screen.queryByLabelText('Mobile navigation')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(menuBtn);
    expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();

    // Click to close
    fireEvent.click(menuBtn);
    expect(screen.queryByLabelText('Mobile navigation')).not.toBeInTheDocument();
  });

  test('closes mobile menu on Escape key', () => {
    window.innerWidth = 375;
    fireEvent(window, new Event('resize'));

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const menuBtn = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuBtn);
    expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByLabelText('Mobile navigation')).not.toBeInTheDocument();
  });

  test('closes dropdown when clicking outside', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const moreBtn = screen.getByRole('button', { name: /More/i });
    fireEvent.click(moreBtn);
    expect(screen.getByText('nav.map')).toBeInTheDocument();

    // Click on something else
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('nav.map')).not.toBeInTheDocument();
  });
});
