import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { useTodos } from './hooks/useTodos';

export default function App() {
  const { todos, addTodo, toggleTodo, editTodo, removeTodo } = useTodos();

  return (
    <main className="mx-auto min-h-screen max-w-xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Todo App</h1>
      <TodoInput onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onEdit={editTodo} onRemove={removeTodo} />
    </main>
  );
}
