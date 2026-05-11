import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TodoInput } from './TodoInput';

describe('TodoInput', () => {
  it('renders the input with placeholder and the Add button', () => {
    render(<TodoInput onAdd={vi.fn()} />);
    expect(screen.getByLabelText('New todo')).toHaveAttribute(
      'placeholder',
      'What needs to be done?',
    );
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('calls onAdd with the typed value and clears the input on Enter', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);
    const input = screen.getByLabelText('New todo');

    await user.type(input, 'buy milk{Enter}');

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith('buy milk');
    expect(input).toHaveValue('');
  });

  it('calls onAdd with the typed value and clears the input on Add button click', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);
    const input = screen.getByLabelText('New todo');

    await user.type(input, 'buy milk');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith('buy milk');
    expect(input).toHaveValue('');
  });

  it('calls onAdd with an empty string when submitting an empty input (hook filters empties)', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith('');
  });

  it('reflects typed value in the controlled input', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);
    const input = screen.getByLabelText('New todo');

    await user.type(input, 'hi');

    expect(input).toHaveValue('hi');
  });
});
