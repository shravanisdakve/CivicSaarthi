import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dialog from './Dialog';
import Button from './Button';

// Helper component to simulate usage with a trigger button
function TestWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={openDialog}>Open Dialog</Button>
      <Dialog
        isOpen={isOpen}
        onClose={closeDialog}
        title="Test Dialog"
        message="This is a test message."
        confirmLabel="Confirm"
        cancelLabel="Cancel"
      />
    </>
  );
}

describe('Dialog', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnConfirm.mockClear();
    // Clear previously focused element reference for clean state between tests
    document.body.innerHTML = '';
  });

  test('does not render when isOpen is false', () => {
    render(<Dialog isOpen={false} onClose={mockOnClose} title="Test" message="Message" />);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  test('renders when isOpen is true with alert type', () => {
    render(
      <Dialog
        isOpen={true}
        onClose={mockOnClose}
        title="Alert Title"
        message="Alert Message"
        type="alert"
        confirmLabel="Got it"
      />
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /got it/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument(); // No cancel for alert
  });

  test('renders when isOpen is true with confirm type', () => {
    render(
      <Dialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Confirm Title"
        message="Confirm Message"
        type="confirm"
        confirmLabel="Proceed"
        cancelLabel="Stop"
      />
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm Title')).toBeInTheDocument();
    expect(screen.getByText('Confirm Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /proceed/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();
  });

  test('calls onClose when Escape key is pressed', () => {
    render(<Dialog isOpen={true} onClose={mockOnClose} title="Test" message="Message" />);
    fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape' }); // Target the dialog itself
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onConfirm when confirm button is clicked (confirm type)', () => {
    render(
      <Dialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Confirm Title"
        message="Confirm Message"
        type="confirm"
        confirmLabel="Proceed"
        cancelLabel="Stop"
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /proceed/i }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(0); // Should not close automatically if onConfirm is provided
  });

  test('calls onClose when cancel button is clicked (confirm type)', () => {
    render(
      <Dialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Confirm Title"
        message="Confirm Message"
        type="confirm"
        confirmLabel="Proceed"
        cancelLabel="Stop"
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /stop/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).toHaveBeenCalledTimes(0);
  });

  test('traps focus within the dialog correctly (confirm then cancel loop)', async () => {
    render(
      <Dialog
        isOpen={true}
        onClose={mockOnClose}
        title="Test"
        message="Message"
        type="confirm" // Ensure both buttons are rendered
        confirmLabel="Confirm"
        cancelLabel="Cancel"
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    // Initial focus is on the confirm button
    await waitFor(() => expect(confirmButton).toHaveFocus());

    // Tab forward from confirm should go to cancel
    fireEvent.keyDown(confirmButton, { key: 'Tab' });
    expect(cancelButton).toHaveFocus();

    // Tab forward from cancel should loop back to confirm
    fireEvent.keyDown(cancelButton, { key: 'Tab' });
    expect(confirmButton).toHaveFocus();

    // Tab backward from confirm should go to cancel
    fireEvent.keyDown(confirmButton, { key: 'Tab', shiftKey: true });
    expect(cancelButton).toHaveFocus();

    // Tab backward from cancel should loop back to confirm
    fireEvent.keyDown(cancelButton, { key: 'Tab', shiftKey: true });
    expect(confirmButton).toHaveFocus();
  });

  test('restores focus to the trigger element after closing', async () => {
    render(<TestWrapper />);

    const openButton = screen.getByRole('button', { name: /open dialog/i });

    // Simulate initial focus on the trigger button
    openButton.focus();
    expect(openButton).toHaveFocus();

    fireEvent.click(openButton); // Open the dialog

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await waitFor(() => expect(confirmButton).toHaveFocus()); // Dialog opens, focus moves to confirm

    fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape' }); // Close the dialog

    // onClose is called by the Dialog's internal logic, which we mock in TestWrapper
    // We expect the focus to return to openButton
    await waitFor(() => expect(openButton).toHaveFocus());
  });
});
