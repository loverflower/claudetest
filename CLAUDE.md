# CLAUDE.md

## Codebase Overview

`claudetest` — учебный SPA todo-приложение для отработки 8-шагового AI workflow Vention. In-memory state, без backend. Задачи приходят из Jira-борды SCRUM и реализуются последовательно (SCRUM-5 → SCRUM-9 → SCRUM-8 → SCRUM-6 → SCRUM-7) через DoR → Plan Mode → Implement → Test → PR.

**Stack:** React 19 + TypeScript 6 (strict, `verbatimModuleSyntax`) + Vite 8 + Tailwind CSS v3 + Vitest 2 + RTL + jsdom + ESLint v10 flat + Prettier 3.

**Structure:**

- `src/types/` — domain interfaces (`Todo`)
- `src/hooks/useTodos.ts` — state + 4 actions (add/toggle/edit/remove)
- `src/components/` — `TodoInput`, `TodoList`, `TodoItem` (inline edit by dblclick)
- `src/App.tsx` — orchestrator, owns the `useTodos` instance
- `docs/specs/` — DoR-спеки тикетов
- `docs/CODEBASE_MAP.md` — auto-generated карта

Для детальной архитектуры, модулей, паттернов и navigation guide — см. [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md).

## Workflow Plan

См. [AI_WORKFLOW_PLAN.md](AI_WORKFLOW_PLAN.md) — порядок тикетов, push policy, CI план, ручные/авто review.

## MCP

- **Atlassian Rovo** (Jira) — поиск/чтение/transition тикетов, source SCRUM-борды.
- **chrome-devtools** — браузерные UI-проверки.

## Conventions

- **Commits:** Conventional Commits (`feat(SCRUM-X)`, `fix(SCRUM-X)`, `chore:`, `docs:`, `test:`).
- **Branches:** `feature/SCRUM-X-kebab`, `chore/...`, `fix/...`, `docs/...`. Прямой коммит/push в `main` запрещён — только PR.
- **TS:** `import type` обязателен для type-only импортов (`verbatimModuleSyntax: true`).
- **Стили:** только Tailwind utility-классы.
- **Тесты:** `describe/it/expect` импортируются явно из `vitest` (`globals: false`).
- **`tsc -b`** для type-check через project references — не `tsc --noEmit` напрямую.
