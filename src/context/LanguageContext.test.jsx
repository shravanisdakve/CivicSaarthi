import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LanguageProvider, LanguageContext } from './LanguageContext';

// Mock translations
jest.mock('../data/translations.js', () => ({
  translations: {
    en: { welcome: 'Welcome' },
    hi: { welcome: 'स्वागत' },
  },
}));

const TestComponent = () => {
  const { language, setLanguage, t } = React.useContext(LanguageContext);
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="trans">{t('welcome')}</span>
      <button onClick={() => setLanguage('hi')}>Change to Hindi</button>
    </div>
  );
};

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('provides default language as en', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(screen.getByTestId('trans')).toHaveTextContent('Welcome');
  });

  test('loads initial language from localStorage', () => {
    localStorage.setItem('civicsaarthi_language', 'hi');
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    expect(screen.getByTestId('lang')).toHaveTextContent('hi');
    expect(screen.getByTestId('trans')).toHaveTextContent('स्वागत');
  });

  test('updates language and persists to localStorage', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    const button = screen.getByText('Change to Hindi');
    act(() => {
      button.click();
    });

    expect(screen.getByTestId('lang')).toHaveTextContent('hi');
    expect(screen.getByTestId('trans')).toHaveTextContent('स्वागत');
    expect(localStorage.getItem('civicsaarthi_language')).toBe('hi');
  });

  test('dispatches civicsLanguageChanged event on change', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    act(() => {
      screen.getByText('Change to Hindi').click();
    });

    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(dispatchSpy.mock.calls[0][0].type).toBe('civicLanguageChanged');
    expect(dispatchSpy.mock.calls[0][0].detail).toBe('hi');
    
    dispatchSpy.mockRestore();
  });
});
