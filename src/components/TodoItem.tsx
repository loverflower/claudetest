import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onRemove: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onEdit, onRemove }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  const startEdit = () => {
    setDraft(todo.title);
    setIsEditing(true);
  };

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.title) {
      onEdit(todo.id, trimmed);
    }
    setIsEditing(false);
  };

  const cancel = () => {
    setDraft(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancel();
    }
  };

  return (
    <li className="flex items-center gap-2 border-b border-gray-200 py-2">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Toggle ${todo.title}`}
        className="h-4 w-4"
      />
      {isEditing ? (
        <input
          type="text"
          value={draft}
          autoFocus
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          className="flex-1 rounded border border-blue-400 px-2 py-1 focus:outline-none"
        />
      ) : (
        <span
          onDoubleClick={startEdit}
          className={`flex-1 cursor-pointer select-none ${
            todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'
          }`}
        >
          {todo.title}
        </span>
      )}
      <button
        type="button"
        onClick={() => onRemove(todo.id)}
        aria-label={`Delete ${todo.title}`}
        className="rounded px-2 py-1 text-gray-500 hover:bg-red-50 hover:text-red-600"
      >
        ×
      </button>
    </li>
  );
}
