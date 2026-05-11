# SCRUM-5 — Create React project. Simple to-do list

**Jira:** https://balashkoevgenij.atlassian.net/browse/SCRUM-5
**Priority:** Highest · **Status:** To Do · **Assignee:** Евгений Балашко

## Objective

Создать с нуля небольшое React-приложение «Todo List» — стартовая точка проекта, на которую будут наложены последующие тикеты (localStorage / фильтр / сортировка). Цель — рабочий MVP, по которому можно отрабатывать AI-workflow из мануала, а не продакшен-приложение.

## Scope

- Vite + React + TypeScript scaffold в корне репозитория.
- Tailwind CSS (v3, классическая конфигурация — стабильно и предсказуемо для CI).
- ESLint + Prettier baseline (typescript-eslint, eslint-plugin-react-hooks, prettier-config совместимый с ESLint).
- Vitest + React Testing Library baseline: `jsdom`-environment, один smoke-тест `App` (рендер без ошибок, виден заголовок), интеграция с Vite через `vitest.config.ts` (или поля `test` в `vite.config.ts`).
- Тип `Todo`: `{ id: string; title: string; completed: boolean; createdAt: number }`.
- UI:
  - Заголовок страницы «Todo App».
  - Поле ввода + кнопка/Enter для добавления нового todo.
  - Список существующих todo. Для каждого элемента:
    - чекбокс `completed` (toggle),
    - текст с inline-edit по двойному клику; Enter — сохранить, Escape — отменить, blur — сохранить,
    - кнопка/иконка `Delete`.
  - Empty state, когда список пуст.
- In-memory state в корневом компоненте (`useState`). Перситентности нет — это работа SCRUM-8.
- Декомпозиция компонентов: `App`, `TodoInput`, `TodoList`, `TodoItem`. Логика управления списком — в кастомном хуке `useTodos` (готовим почву для SCRUM-6, где явно требуется хук).
- README обновлён: краткое описание, команды `npm install / dev / build / lint`.

## Non-scope

- localStorage / любая персистентность → SCRUM-8.
- Фильтр по статусу/тексту → SCRUM-6.
- Сортировка → SCRUM-7.
- Drag-and-drop, теги, дедлайны, приоритеты, описание todo, поиск.
- Аутентификация, backend, любая сеть.
- Тёмная тема, i18n.
- Любые тесты сверх одного smoke-теста App (полное покрытие хука/компонентов — для будущих тикетов).
- Анимации сверх минимума, который даёт Tailwind по умолчанию.

## Constraints

- **Stack:** React 18.x + TypeScript 5.x (strict), Vite 5.x, Tailwind v3.x. Без других UI-библиотек (Material/Chakra/etc.).
- **TS strict:** `"strict": true`. Никаких `any`, `@ts-ignore` без обоснования в комменте.
- **Идентификаторы todo:** `crypto.randomUUID()`.
- **Валидация title:** при создании и при edit — `trim()`, пустая строка не сохраняется (на add — кнопка/Enter no-op; на edit — Escape-эквивалент, остаётся прежнее значение).
- **Delete:** без подтверждения (стандарт TodoMVC, минимальный UX).
- **A11y базово:** `<label>` к input, `aria-label` на иконочных кнопках, чекбокс — нативный `<input type="checkbox">`, focusable элементы достижимы клавиатурой.
- **Lint/format:** `npm run lint` (eslint) и `npm run format` (prettier --write) должны проходить без ошибок.
- **Tests:** `npm test` (vitest run) проходит — минимум один smoke-тест App зелёный.
- **TypeScript:** `npx tsc --noEmit` проходит без ошибок.
- **Build:** `npm run build` (vite) собирается без warning.
- **Стили:** только через Tailwind utility-классы. Никаких отдельных CSS-файлов, кроме `src/index.css` с `@tailwind base/components/utilities`.

## Relevant files / areas

После scaffold ожидаемая структура (приблизительно — финал в плане):

```
.
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── .eslintrc.cjs (или eslint.config.js)
├── .prettierrc
├── .gitignore
├── vitest.config.ts     # либо поле `test` в vite.config.ts
├── README.md            # обновляется
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.test.tsx     # smoke-тест (vitest + RTL)
│   ├── setupTests.ts    # @testing-library/jest-dom matchers
│   ├── index.css        # tailwind directives
│   ├── types/
│   │   └── todo.ts      # тип Todo
│   ├── hooks/
│   │   └── useTodos.ts  # add / toggle / edit / remove
│   └── components/
│       ├── TodoInput.tsx
│       ├── TodoList.tsx
│       └── TodoItem.tsx
└── docs/specs/SCRUM-5.md  # этот файл
```

Не трогаем: `AI_WORKFLOW_PLAN.md`, `AI manual for individual exploration.md`, `main.txt`.

## Acceptance criteria

1. `npm install && npm run dev` запускает приложение на `localhost:5173`.
2. На главной странице видно заголовок, инпут добавления и пустой list со строкой empty state.
3. Можно добавить todo через Enter или кнопку — он появляется в списке, инпут очищается.
4. Попытка добавить пустой/whitespace-only title не создаёт todo.
5. Чекбокс переключает `completed`; визуально завершённые todo отличаются (например, line-through и приглушённый цвет).
6. Двойной клик по тексту todo превращает его в `<input>` со значением title; Enter / blur — сохраняет (с trim), Escape — откатывает; пустое значение после trim → откат.
7. Клик по Delete удаляет элемент из списка.
8. После reload страницы список пуст (персистентности нет — это SCRUM-8).
9. `npm run lint` — zero errors. `npm run format -- --check` — clean. `npx tsc --noEmit` — clean. `npm run build` — успех. `npm test` — все тесты зелёные.
10. README содержит описание и список команд (включая `npm test`).

## Links

- Jira: SCRUM-5
- План: `AI_WORKFLOW_PLAN.md`
- Связанные тикеты: SCRUM-8 (localStorage), SCRUM-6 (фильтр), SCRUM-7 (сортировка)

## Open questions (до plan mode)

_Закрыты._
- Тесты: Vitest + RTL baseline + 1 smoke-тест (закреплено в Scope/Constraints).
- GitHub remote: подтверждён, см. `git remote -v` (отдельный лог сессии).
