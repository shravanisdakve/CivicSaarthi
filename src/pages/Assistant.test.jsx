import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Assistant from './Assistant';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { getProfile } from '../utils/profileStorage';

// Mock dependencies
jest.mock('../hooks/useTranslation');
jest.mock('../utils/profileStorage');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Assistant Page', () => {
  const mockT = jest.fn((key) => key);
  
  beforeEach(() => {
    jest.clearAllMocks();
    useTranslation.mockReturnValue({
      language: 'en',
      t: mockT,
    });
    getProfile.mockReturnValue({ name: 'Guest Citizen' });
    useSearchParams.mockReturnValue([new URLSearchParams(), jest.fn()]);
    fetch.mockImplementation((url) => {
      if (url === '/api/status') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ geminiConfigured: true }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ response: 'AI response' }),
      });
    });
  });

  test('renders initial welcome message', () => {
    render(
      <MemoryRouter>
        <Assistant />
      </MemoryRouter>
    );

    expect(screen.getByText(/I'm CivicSaarthi AI/i)).toBeInTheDocument();
  });

  test('shows suggested questions', () => {
    render(
      <MemoryRouter>
        <Assistant />
      </MemoryRouter>
    );

    expect(screen.getByText(/How do I register to vote\?/i)).toBeInTheDocument();
  });

  test('sends message and displays response', async () => {
    fetch.mockImplementation((url) => {
      if (url === '/api/chat') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ response: 'This is an AI response.' }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ geminiConfigured: true }) });
    });

    render(
      <MemoryRouter>
        <Assistant />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Type your question/i);
    fireEvent.change(input, { target: { value: 'test question' } });
    fireEvent.submit(input.closest('form'));

    await waitFor(() => {
      expect(screen.getByText('This is an AI response.')).toBeInTheDocument();
    });
  });

  test('displays summarize prompt when reference has a different source language', async () => {
    fetch.mockImplementation((url) => {
      if (url === '/api/chat') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            response: 'AI response with reference.',
            grounded: true,
            references: [{ 
              title: 'Official Source', 
              sourceLanguage: 'Hindi', 
              sourceLanguageCode: 'hi',
              sourceName: 'ECI',
              url: 'http://example.com' 
            }]
          }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ geminiConfigured: true }) });
    });

    render(
      <MemoryRouter>
        <Assistant />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Type your question/i);
    fireEvent.change(input, { target: { value: 'tell me about source' } });
    fireEvent.submit(input.closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/This source is in Hindi/i)).toBeInTheDocument();
      expect(screen.getByText(/Summarize it in English\?/i)).toBeInTheDocument();
    });
  });

  test('summarize button triggers a new message in current language', async () => {
    useTranslation.mockReturnValue({
      language: 'hi',
      t: mockT,
    });

    fetch.mockImplementation((url, options) => {
      if (url === '/api/chat') {
        const body = JSON.parse(options.body);
        if (body.message.includes('Summarize')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ response: 'Hindi summary response.' }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            response: 'AI response with reference.',
            grounded: true,
            references: [{ 
              title: 'Official Source', 
              sourceLanguage: 'English', 
              sourceLanguageCode: 'en',
              sourceName: 'ECI',
              url: 'http://example.com' 
            }]
          }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ geminiConfigured: true }) });
    });

    render(
      <MemoryRouter>
        <Assistant />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/अपना प्रश्न लिखें/i);
    fireEvent.change(input, { target: { value: 'hi' } });
    fireEvent.submit(input.closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/Summarize it in Hindi\?/i)).toBeInTheDocument();
    });

    const summarizeBtn = screen.getByRole('button', { name: /Summarize/i });
    fireEvent.click(summarizeBtn);

    await waitFor(() => {
      expect(screen.getByText('Hindi summary response.')).toBeInTheDocument();
    });
  });

  test('multilingual parity badge is visible', () => {
    render(
      <MemoryRouter>
        <Assistant />
      </MemoryRouter>
    );

    expect(screen.getByText(/Multilingual Parity/i)).toBeInTheDocument();
  });
});
