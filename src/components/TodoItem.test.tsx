import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import type { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return { id: 'id-1', title: 'buy milk', completed: false, createdAt: 1, ...overrides };
}

interface RenderItemOptions {
  todo?: Todo;
  onToggle?: Mock;
  onEdit?: Mock;
  onRemove?: Mock;
}

function renderItem(options: RenderItemOptions = {}) {
  const todo = options.todo ?? makeTodo();
  const onToggle = options.onToggle ?? vi.fn();
  const onEdit = options.onEdit ?? vi.fn();
  const onRemove = options.onRemove ?? vi.fn();

  render(
    <ul>
      <TodoItem todo={todo} onToggle={onToggle} onEdit={onEdit} onRemove={onRemove} />
    </ul>,
  );

  return { todo, onToggle, onEdit, onRemove };
}

describe('TodoItem', () => {
  it('renders title, unchecked checkbox, and delete button', () => {
    renderItem();

    expect(screen.getByText('buy milk')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /toggle buy milk/i })).not.toBeChecked();
    expect(screen.getByRole('button', { name: /delete buy milk/i })).toBeInTheDocument();
  });

  it('renders checkbox as checked when todo.completed is true', () => {
    renderItem({ todo: makeTodo({ completed: true }) });

    expect(screen.getByRole('checkbox', { name: /toggle/i })).toBeChecked();
  });

  it('applies line-through class when completed', () => {
    renderItem({ todo: makeTodo({ completed: true }) });

    expect(screen.getByText('buy milk')).toHaveClass('line-through');
  });

  it('does not apply line-through when not completed', () => {
    renderItem();

    expect(screen.getByText('buy milk')).not.toHaveClass('line-through');
  });

  it('calls onToggle with todo.id when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    renderItem({ onToggle });

    await user.click(screen.getByRole('checkbox', { name: /toggle/i }));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith('id-1');
  });

  it('calls onRemove with todo.id when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    renderItem({ onRemove });

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledWith('id-1');
  });

  describe('edit mode', () => {
    it('enters edit mode on double-click on the title', async () => {
      const user = userEvent.setup();
      renderItem();

      await user.dblClick(screen.getByText('buy milk'));

      expect(screen.getByDisplayValue('buy milk')).toBeInTheDocument();
    });

    it('commits the trimmed value and calls onEdit on Enter', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      renderItem({ onEdit });

      await user.dblClick(screen.getByText('buy milk'));
      const input = screen.getByDisplayValue('buy milk');
      await user.clear(input);
      await user.type(input, 'buy oat milk{Enter}');

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit).toHaveBeenCalledWith('id-1', 'buy oat milk');
      expect(screen.queryByDisplayValue('buy oat milk')).not.toBeInTheDocument();
    });

    it('cancels and does not call onEdit on Escape', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      renderItem({ onEdit });

      await user.dblClick(screen.getByText('buy milk'));
      const input = screen.getByDisplayValue('buy milk');
      await user.clear(input);
      await user.type(input, 'something else{Escape}');

      expect(onEdit).not.toHaveBeenCalled();
      expect(screen.getByText('buy milk')).toBeInTheDocument();
    });

    it('commits on blur (tab out)', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      renderItem({ onEdit });

      await user.dblClick(screen.getByText('buy milk'));
      const input = screen.getByDisplayValue('buy milk');
      await user.clear(input);
      await user.type(input, 'buy oat milk');
      await user.tab();

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit).toHaveBeenCalledWith('id-1', 'buy oat milk');
    });

    it('does not call onEdit when trimmed value is empty (rollback)', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      renderItem({ onEdit });

      await user.dblClick(screen.getByText('buy milk'));
      const input = screen.getByDisplayValue('buy milk');
      await user.clear(input);
      await user.keyboard('{Enter}');

      expect(onEdit).not.toHaveBeenCalled();
    });

    it('does not call onEdit when value is unchanged after trim', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      renderItem({ onEdit });

      await user.dblClick(screen.getByText('buy milk'));
      await user.keyboard('{Enter}');

      expect(onEdit).not.toHaveBeenCalled();
    });

    it('trims surrounding whitespace before calling onEdit', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      renderItem({ onEdit });

      await user.dblClick(screen.getByText('buy milk'));
      const input = screen.getByDisplayValue('buy milk');
      await user.clear(input);
      await user.type(input, '  new title  {Enter}');

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit).toHaveBeenCalledWith('id-1', 'new title');
    });
  });
});
