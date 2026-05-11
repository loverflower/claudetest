import { useState } from 'react';
import type { FormEvent } from 'react';

interface TodoInputProps {
  onAdd: (title: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAdd(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <label htmlFor="new-todo" className="sr-only">
        New todo
      </label>
      <input
        id="new-todo"
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Add
      </button>
    </form>
  );
}
