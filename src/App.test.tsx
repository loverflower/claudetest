import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing and shows the "Todo App" heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /todo app/i })).toBeInTheDocument();
  });
});
