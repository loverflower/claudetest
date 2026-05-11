import { useCallback, useState } from 'react';
import type { Todo } from '../types/todo';

export interface UseTodosApi {
  todos: Todo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  editTodo: (id: string, title: string) => void;
  removeTodo: (id: string) => void;
}

export function useTodos(initial: Todo[] = []): UseTodosApi {
  const [todos, setTodos] = useState<Todo[]>(initial);

  const addTodo = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
    ]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  }, []);

  const editTodo = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, title: trimmed } : todo)));
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  return { todos, addTodo, toggleTodo, editTodo, removeTodo };
}
