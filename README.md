# claudetest — Todo App

[![CI](https://github.com/loverflower/claudetest/actions/workflows/ci.yml/badge.svg)](https://github.com/loverflower/claudetest/actions/workflows/ci.yml)

Обучающий проект для прогонки AI-workflow по `AI manual for individual exploration.md`. Простое to-do приложение на React + TypeScript + Tailwind CSS + Vitest. Реализуется тикетами SCRUM-5 .. SCRUM-8 из Jira-борды.

## Stack

- React 19 + TypeScript 6 (strict)
- Vite 8
- Tailwind CSS v3
- ESLint v10 (flat config) + Prettier 3
- Vitest 2 + React Testing Library + jsdom

## Commands

```powershell
npm install        # установить зависимости
npm run dev        # dev-сервер на http://localhost:5173
npm run build      # production-сборка в dist/
npm run preview    # просмотр production-сборки
npm run lint       # ESLint, 0 предупреждений
npm run format     # Prettier --write
npm run format:check  # Prettier --check
npm run typecheck  # tsc -b (project references)
npm test           # Vitest run (одноразово)
npm run test:watch # Vitest в watch-режиме
npm run coverage   # Vitest run + V8 coverage report (caталог coverage/, в .gitignore)
```

## Status

- **SCRUM-5** ✅ merged — базовый CRUD
- **SCRUM-9** — unit-тесты для useTodos + компонентов (next)
- **SCRUM-8** — localStorage (queued)
- **SCRUM-6** — фильтрация (queued)
- **SCRUM-7** — сортировка по имени (queued)

## CI

Каждый PR в `main` проходит через GitHub Actions workflow `.github/workflows/ci.yml`:
`npm ci` → `lint` → `format:check` → `typecheck` → `test` → `build`. Все шаги должны быть зелёными для merge.

См. `AI_WORKFLOW_PLAN.md` для общего workflow и `docs/specs/SCRUM-5.md` для текущей спеки.
