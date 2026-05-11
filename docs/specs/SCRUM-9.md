# SCRUM-9 — Unit-тесты для useTodos и компонентов

**Jira:** https://balashkoevgenij.atlassian.net/browse/SCRUM-9
**Priority:** Medium · **Status:** In Progress · **Assignee:** Евгений Балашко

## Objective

Покрыть существующий функционал `useTodos` + компонентов unit-тестами, чтобы при работе над SCRUM-6 (фильтр), SCRUM-7 (сортировка) и SCRUM-8 (localStorage) был надёжный regression-safety-net. Baseline для всех последующих тикетов.

## Scope

- `src/hooks/useTodos.ts` — тесты через `renderHook` из RTL:
  - `addTodo`: успешное добавление, генерация id, корректный `createdAt`, trim, no-op на пустую строку, no-op на whitespace, иммутабельность (новый массив, prev не мутируется)
  - `toggleTodo`: переключение `completed` обратно и вперёд, не трогает другие todo
  - `editTodo`: успешное редактирование, trim, no-op на пустую/whitespace, не трогает другие поля
  - `removeTodo`: удаление по id, не трогает другие todo
  - Стабильность ссылок: action-функции не пересоздаются между рендерами (через `useCallback` с empty deps)
  - `initial`-параметр инициализирует state
- `src/components/TodoInput.tsx`:
  - Submit через Enter — вызывает `onAdd(value)`, очищает input
  - Submit через кнопку Add — то же самое
  - Пустой/whitespace ввод — `onAdd` всё равно вызывается с пустым значением (хук сам отфильтрует), input очищается
  - Label правильно ассоциирован с input (`htmlFor` = `id`)
- `src/components/TodoItem.tsx`:
  - Рендерит title, чекбокс, кнопку Delete
  - Чекбокс toggle вызывает `onToggle(todo.id)`
  - Завершённый todo: text имеет `line-through` класс
  - Незавершённый: `text-gray-900`, нет `line-through`
  - Двойной клик по тексту → переход в edit-mode (виден input с фокусом)
  - Enter в edit-input → `onEdit(id, trimmed)` + выход из edit
  - Escape в edit-input → выход из edit, `onEdit` НЕ вызывается
  - Blur edit-input → commit (same as Enter), `onEdit` вызывается
  - Пустой trim в edit → выход из edit, `onEdit` НЕ вызывается (rollback)
  - Неизменённое значение → выход из edit, `onEdit` НЕ вызывается (дополнительный guard)
  - Кнопка Delete → `onRemove(todo.id)`
- `src/components/TodoList.tsx`:
  - Пустой `todos` → empty state «No todos yet», нет `<ul>`
  - Непустой → `<ul>` с правильным числом `<li>` (по одному на todo)
  - Props прокидываются корректно (smoke-проверка через интеграцию с TodoItem-моком или просто через рендер реальных детей)
- **Существующий `src/App.test.tsx`** — оставить как есть, не трогать.

## Non-scope

- e2e-тесты (Playwright/Cypress).
- Coverage threshold-гейт в CI (запуск `coverage` остаётся manual).
- Изменение поведения / API хука или компонентов — только тесты.
- Snapshot-тесты — не использовать (хрупкие, не дают ясной диагностики).
- Тесты на стилизацию через regex match Tailwind-классов — только проверять ключевые классы (`line-through`), не весь набор.

## Constraints

- **Stack** уже установлен в SCRUM-5: Vitest 2, `@testing-library/react@16`, `@testing-library/user-event@14`, `@testing-library/jest-dom@6.6`, `jsdom@25`.
- **Стиль interaction'ов:** `userEvent` (v14) поверх `fireEvent`. Каждый тест с user-event делает `const user = userEvent.setup()` перед `render`.
- **Изоляция:** каждый тест в `describe` блоке, никаких side-effects между тестами (`renderHook`/`render` создают чистый DOM).
- **`describe/it/expect`** импортируются явно из `vitest` (`globals: false` в `vitest.config.ts`).
- **`import type`** для type-only импортов (`verbatimModuleSyntax: true`).
- **`vi.useFakeTimers` НЕ используем** для `createdAt` — проверяем `typeof === 'number'` и `> 0` (Date.now-based).
- **`crypto.randomUUID()` тоже НЕ мокаем** — проверяем `typeof === 'string'` и `length > 0` (или соответствие UUID-regex). jsdom 25+ имеет нативный API.
- **Расположение:** `*.test.ts(x)` РЯДОМ с тестируемым файлом (не в `__tests__/` каталог).
- **Coverage:** добавить `npm run coverage` script (`vitest run --coverage`) — упрощает manual-проверку AC #5. Сам каталог `coverage/` уже в `.gitignore`.
- **Aria/role queries:** предпочитать `getByRole`/`getByLabelText` над `getByText` — стабильнее к рефакторингу UI.

## Relevant files / areas

Новые файлы:

```
src/
├── hooks/
│   ├── useTodos.ts            # уже существует, не трогать
│   └── useTodos.test.ts       # NEW
├── components/
│   ├── TodoInput.tsx          # уже существует
│   ├── TodoInput.test.tsx     # NEW
│   ├── TodoList.tsx           # уже существует
│   ├── TodoList.test.tsx      # NEW
│   ├── TodoItem.tsx           # уже существует
│   └── TodoItem.test.tsx      # NEW
```

Изменяемые файлы:

- `package.json` — добавить `"coverage": "vitest run --coverage"` в scripts
- `README.md` — добавить `npm run coverage` в список команд

Не трогаем: `src/App.test.tsx`, любые компоненты/хуки (нет behavior changes), все конфиги (vitest.config.ts, tsconfig*, eslint, prettier, tailwind).

## Acceptance criteria

1. Созданы 4 файла тестов: `useTodos.test.ts`, `TodoInput.test.tsx`, `TodoList.test.tsx`, `TodoItem.test.tsx`.
2. `npm test` — все тесты зелёные (старый smoke + новые).
3. `npm run lint` — 0 ошибок, 0 warnings.
4. `npm run format:check` — clean.
5. `npm run typecheck` — clean.
6. `npm run build` — succeeds, no warnings.
7. CI workflow на PR — green.
8. `npm run coverage` запускается, выдаёт отчёт. Целевое покрытие `useTodos.ts` — 100% branches/statements (это основной бизнес-логический файл).
9. Каждый файл хука/компонента имеет минимум один тест (5 файлов исходного кода → 5 файлов с тестами, считая существующий `App.test.tsx`).
10. README обновлён: `npm run coverage` в команде. Никаких изменений в `useTodos.ts` или компонентах.

## Open questions (до plan mode)

_Закрыты дефолтами выше._
- Расположение тестов: `*.test.ts(x)` рядом с файлами (не `__tests__/`).
- Interaction style: `userEvent.setup()` v14, не `fireEvent`.
- Тестирование хука: `renderHook` из `@testing-library/react`.
- Подход к `Date.now()` / `crypto.randomUUID()`: не мокать, проверять тип и валидность.
- Coverage: добавить `npm run coverage` script.
- Не делать: snapshot-тесты, тесты на Tailwind classes сверх ключевых.
