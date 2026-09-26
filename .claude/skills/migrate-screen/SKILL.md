---
name: migrate-screen
description: Port a screen from the old fancreed app into this codebase — map it to a feature module and rewrite it with the new conventions (Text/Icon, Unistyles theme tokens, React Query hooks, i18n, Zustand selectors). Use when the user asks to migrate/move/port a screen from the old app.
---

# Migrate Screen

Input: path to the old screen file (and its related components/hooks/API calls). If the path isn't given, ask for it. Goal: **same behaviour and UI, new architecture** — not a line-by-line copy.

## 1. Understand the old screen (report before writing)

Read the old screen and everything it uses. Summarise for the user in a short list:

- what it shows and does (states: loading, empty, error, success)
- API calls (endpoint, request/response fields)
- global state it reads/writes
- navigation in/out (params)
- strings, icons, images

Ask about anything ambiguous (dead code, unclear behaviour) before step 2.

## 2. Map to the new structure

| Old                                                | New                                                                                                              |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Screen                                             | `src/features/[feature]/screens/[Name]Screen/` (+ thin route in `src/app/`) — use `/new-feature` conventions     |
| Screen-only components                             | `src/features/[feature]/components/`                                                                             |
| Reused UI (buttons, inputs…)                       | existing `src/ui/components/*` — create via `/new-component` if missing                                          |
| `fetch`/axios calls                                | method on `api` in `src/api/api.ts` + types in `src/types/api.ts` + hook in `src/hooks/query/` using `fetcher()` |
| Redux/Context/global state                         | Zustand store in `src/store/` (selectors only) — or React Query if it's server data                              |
| Hardcoded strings                                  | i18n keys in **both** `en.json` and `uk.json`                                                                    |
| Raw `Text` / `StyleSheet` / hex colours / px sizes | `Text` variants, `Icon`, `theme.colors.*`, `theme.spacing()`, `theme.radius.*`                                   |
| SVG / icon fonts                                   | `Icon name="…"`; new icons → drop SVG in `assets/icons/`, run `yarn icons`                                       |
| Tokens in AsyncStorage                             | already handled — `useAuthStore` + SecureStore; don't port old token code                                        |
| Forms                                              | react-hook-form + `zodResolver` from `@hookform/resolvers/zod`, schema in `src/schemas/`                         |

Keep the old API field names exactly — never guess new ones. If the old code has a bug, keep behaviour and **flag it** rather than silently fixing.

## 3. Write, then verify

- `yarn type-check && yarn lint && yarn test`
- Add a screen test for critical flows (auth, payments, onboarding).
- Report: what was migrated, what was deliberately changed, open questions, what wasn't verified on a device. Do not commit.
