import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Quiz from './Quiz';
import { MemoryRouter } from 'react-router-dom';
import { quizQuestions } from '../data/quiz';
import { getProfile } from '../utils/profileStorage';

// Mock profileStorage
jest.mock('../utils/profileStorage', () => ({
  getProfile: jest.fn(),
  saveQuizProgress: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Quiz Page', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    mockNavigate.mockClear();
    getProfile.mockReturnValue({ name: 'Test User' });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders first question correctly', () => {
    render(
      <MemoryRouter>
        <Quiz />
      </MemoryRouter>
    );

    expect(screen.getByText(quizQuestions[0].question)).toBeInTheDocument();
    expect(screen.getByText(quizQuestions[0].options[0])).toBeInTheDocument();
  });

  test('shows feedback and auto-advances after selecting an answer', async () => {
    render(
      <MemoryRouter>
        <Quiz />
      </MemoryRouter>
    );

    // Select the correct answer (index 1 for the first question)
    const correctAnswer = screen.getByText(quizQuestions[0].options[1]);
    fireEvent.click(correctAnswer);

    // Should show feedback
    expect(screen.getByText(/Brilliant!/i)).toBeInTheDocument();
    expect(screen.getByText(quizQuestions[0].explanation)).toBeInTheDocument();

    // Should show countdown
    expect(screen.getByText(/Next in 5s/i)).toBeInTheDocument();

    // Advance time by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Should show the next question
    await waitFor(() => {
      expect(screen.getByText(quizQuestions[1].question)).toBeInTheDocument();
    });
  });

  test('handles incorrect answer correctly', async () => {
    render(
      <MemoryRouter>
        <Quiz />
      </MemoryRouter>
    );

    // Select an incorrect answer (index 0 for the first question)
    const incorrectAnswer = screen.getByText(quizQuestions[0].options[0]);
    fireEvent.click(incorrectAnswer);

    // Should show "Not quite" feedback
    expect(screen.getByText(/Not quite/i)).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(screen.getByText(quizQuestions[1].question)).toBeInTheDocument();
    });
  });

  test('completes quiz and shows results', async () => {
    render(
      <MemoryRouter>
        <Quiz />
      </MemoryRouter>
    );

    // Answer all questions correctly
    for (let i = 0; i < quizQuestions.length; i++) {
      const q = quizQuestions[i];
      const correctOpt = screen.getByText(q.options[q.correct]);
      fireEvent.click(correctOpt);
      
      act(() => {
        jest.advanceTimersByTime(5000);
      });
    }

    // Should show completion screen
    await waitFor(() => {
      const completionText = screen.queryByText(/Quiz Completed!/i) || screen.queryByText(/Good progress/i);
      expect(completionText).toBeInTheDocument();
      expect(screen.getByText(/You scored 100%/i)).toBeInTheDocument();
    });
  });

  test('can restart the quiz', async () => {
    render(
      <MemoryRouter>
        <Quiz />
      </MemoryRouter>
    );

    // Answer one question
    fireEvent.click(screen.getByText(quizQuestions[0].options[0]));
    
    // Click reset progress
    const resetBtn = screen.getByText(/Reset Quiz Progress/i);
    fireEvent.click(resetBtn);

    // Should be back at question 1
    expect(screen.getByText(quizQuestions[0].question)).toBeInTheDocument();
    expect(screen.queryByText(/Next in 5s/i)).not.toBeInTheDocument();
  });
});
