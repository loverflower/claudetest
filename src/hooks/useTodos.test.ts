import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { Todo } from '../types/todo';
import { useTodos } from './useTodos';

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return { id: 'id-1', title: 'buy milk', completed: false, createdAt: 1, ...overrides };
}

describe('useTodos', () => {
  it('initialises with an empty array when no argument is given', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('initialises with the provided initial array', () => {
    const initial = [makeTodo()];
    const { result } = renderHook(() => useTodos(initial));
    expect(result.current.todos).toEqual(initial);
  });

  describe('addTodo', () => {
    it('appends a new todo with trimmed title, generated id, false completed, numeric createdAt', () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo('foo'));

      expect(result.current.todos).toHaveLength(1);
      const [todo] = result.current.todos;
      expect(todo.title).toBe('foo');
      expect(todo.completed).toBe(false);
      expect(typeof todo.id).toBe('string');
      expect(todo.id.length).toBeGreaterThan(0);
      expect(typeof todo.createdAt).toBe('number');
      expect(todo.createdAt).toBeGreaterThan(0);
    });

    it('trims surrounding whitespace from the title', () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo('  foo  '));
      expect(result.current.todos[0].title).toBe('foo');
    });

    it('ignores empty string', () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo(''));
      expect(result.current.todos).toEqual([]);
    });

    it('ignores whitespace-only input', () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo('   '));
      expect(result.current.todos).toEqual([]);
    });

    it('generates a unique id per call', () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo('a'));
      act(() => result.current.addTodo('b'));
      const [a, b] = result.current.todos;
      expect(a.id).not.toBe(b.id);
    });

    it('does not mutate the previous todos array', () => {
      const { result } = renderHook(() => useTodos());
      act(() => result.current.addTodo('a'));
      const before = result.current.todos;
      act(() => result.current.addTodo('b'));
      expect(result.current.todos).not.toBe(before);
      expect(before).toHaveLength(1);
    });
  });

  describe('toggleTodo', () => {
    it('toggles completed from false to true', () => {
      const initial = [makeTodo({ id: '1', completed: false })];
      const { result } = renderHook(() => useTodos(initial));
      act(() => result.current.toggleTodo('1'));
      expect(result.current.todos[0].completed).toBe(true);
    });

    it('toggles completed back to false on a second call', () => {
      const initial = [makeTodo({ id: '1', completed: false })];
      const { result } = renderHook(() => useTodos(initial));
      act(() => result.current.toggleTodo('1'));
      act(() => result.current.toggleTodo('1'));
      expect(result.current.todos[0].completed).toBe(false);
    });

    it('only toggles the matching todo', () => {
      const initial = [
        makeTodo({ id: '1', completed: false }),
        makeTodo({ id: '2', completed: false }),
      ];
      const { result } = renderHook(() => useTodos(initial));
      act(() => result.current.toggleTodo('1'));
      expect(result.current.todos[0].completed).toBe(true);
      expect(result.current.todos[1].completed).toBe(false);
    });

    it('is a no-op for an unknown id', () => {
      const initial = [makeTodo({ id: '1' })];
      const { result } = renderHook(() => useTodos(initial));
      act(() => result.current.toggleTodo('unknown'));
      expect(result.current.todos[0].completed).toBe(false);
    });
  });

  describe('editTodo', () => {
    it('updates the title with a trimmed value', () => {
      const initial = [makeTodo({ id: '1', title: 'old' })];
      const { result } = renderHook(() => useTodos(initial));
      act(() => result.current.editTodo('1', '  new  '));
      expect(result.current.todos[0].title).toBe('new');
    });

    it('ignores empty value (no-op)', () => {
      const initial = [makeTodo({ id: '1', title: 'old' })];
      const { result } = renderHook(() => useTodos(initial));
      act(() => result.current.editTodo('1', ''));
      expect(result.current.todos[0].title).toBe('old');
    });

    it('ignores whitespace-only value (no-op)', () => {
      const initial = [makeTodo({ id: '1', title: 'old' })];
      const { result } = renderHook(() => useTodos(initial));
      act(() => result.current.editTodo('1', '   '));
      expect(result.current.todos[0].title).toBe('old');
    });

    it('only edits the matching todo', () => {
      const initial = [makeTodo({ id: '1', title: 'A' }), makeTodo({ id: '2', title: 'B' })];
      const { result } = renderHook(() => useTodos(initial));
      act(() => result.current.editTodo('1', 'AA'));
      expect(result.current.todos[0].title).toBe('AA');
      expect(result.current.todos[1].title).toBe('B');
    });

    it('preserves completed and createdAt when editing the title', () => {
      const initial = [makeTodo({ id: '1', completed: true, createdAt: 12345 })];
      const { result } = renderHook(() => useTodos(initial));
      act(() => result.current.editTodo('1', 'renamed'));
      expect(result.current.todos[0].completed).toBe(true);
      expect(result.current.todos[0].createdAt).toBe(12345);
    });
  });

  describe('removeTodo', () => {
    it('removes the matching todo', () => {
      const initial = [makeTodo({ id: '1' })];
      const { result } = renderHook(() => useTodos(initial));
      act(() => result.current.removeTodo('1'));
      expect(result.current.todos).toEqual([]);
    });

    it('only removes the one with the matching id', () => {
      const initial = [makeTodo({ id: '1' }), makeTodo({ id: '2' })];
      const { result } = renderHook(() => useTodos(initial));
      act(() => result.current.removeTodo('1'));
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].id).toBe('2');
    });

    it('is a no-op for an unknown id', () => {
      const initial = [makeTodo({ id: '1' })];
      const { result } = renderHook(() => useTodos(initial));
      act(() => result.current.removeTodo('unknown'));
      expect(result.current.todos).toHaveLength(1);
    });
  });

  describe('callback stability', () => {
    it('returns stable action references across re-renders', () => {
      const { result, rerender } = renderHook(() => useTodos());
      const first = {
        add: result.current.addTodo,
        toggle: result.current.toggleTodo,
        edit: result.current.editTodo,
        remove: result.current.removeTodo,
      };
      rerender();
      expect(result.current.addTodo).toBe(first.add);
      expect(result.current.toggleTodo).toBe(first.toggle);
      expect(result.current.editTodo).toBe(first.edit);
      expect(result.current.removeTodo).toBe(first.remove);
    });
  });
});
