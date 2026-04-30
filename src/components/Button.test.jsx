import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button'; // Adjust path if necessary

describe('Button', () => {
  test('renders with default variant and size', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-primary'); // Check for primary variant class
    expect(buttonElement).toHaveClass('px-6 py-2'); // Check for md size class
  });

  test('renders with a custom variant and size', () => {
    render(
      <Button variant="secondary" size="lg">
        Submit
      </Button>
    );
    const buttonElement = screen.getByText(/submit/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-secondary'); // Check for secondary variant class
    expect(buttonElement).toHaveClass('px-8 py-3'); // Check for lg size class
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Test Click</Button>);
    const buttonElement = screen.getByText(/test click/i);
    buttonElement.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByText(/disabled button/i);
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveAttribute('aria-disabled', 'true');
  });

  test('applies aria-label when provided', () => {
    render(<Button ariaLabel="Close dialog">X</Button>);
    const buttonElement = screen.getByLabelText(/close dialog/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute('aria-label', 'Close dialog');
  });
});
