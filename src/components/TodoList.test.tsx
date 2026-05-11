import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { Todo } from '../types/todo';
import { TodoList } from './TodoList';

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return { id: 'id-1', title: 'buy milk', completed: false, createdAt: 1, ...overrides };
}

describe('TodoList', () => {
  it('shows the empty state when there are no todos', () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onEdit={vi.fn()} onRemove={vi.fn()} />);

    expect(screen.getByText('No todos yet')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders one list item per todo', () => {
    const todos = [makeTodo({ id: '1', title: 'A' }), makeTodo({ id: '2', title: 'B' })];

    render(<TodoList todos={todos} onToggle={vi.fn()} onEdit={vi.fn()} onRemove={vi.fn()} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('does not render the empty state when there are todos', () => {
    const todos = [makeTodo()];

    render(<TodoList todos={todos} onToggle={vi.fn()} onEdit={vi.fn()} onRemove={vi.fn()} />);

    expect(screen.queryByText('No todos yet')).not.toBeInTheDocument();
  });
});
