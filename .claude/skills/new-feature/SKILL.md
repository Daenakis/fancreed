---
name: new-feature
description: Scaffold a new feature module in src/features/[name] with screen(s), barrel files, thin route file(s) and i18n keys, following fancreed conventions. Use when the user asks to add a new feature, section or screen group.
---

# New Feature

Input: feature name (e.g. `matches`) and the screens it needs (e.g. `MatchesScreen`, `MatchDetailScreen`) plus the route path(s). If the route or protection (signed-in vs public) is unclear, ask before writing.

Read `src/docs/features.md` first. Use `src/features/home/` as the reference implementation.

## Steps

1. **Folders** — create:

   ```
   src/features/[name]/
   ├── screens/[Name]Screen/{[Name]Screen.tsx, index.ts}
   ├── screens/index.ts
   └── index.ts
   ```

   Add `components/`, `hooks/`, `types.ts` only when actually needed — no empty folders.

2. **Screen** — function component, named export. Rules:
   - Text via `Text` from `@/ui/components` with a `variant` — never `fontSize`/`fontWeight`.
   - Icons via `Icon` from `@/ui/components`.
   - Styles via `StyleSheet.create((theme) => …)` from `react-native-unistyles` at the bottom; colours/spacing/radius from `theme.*` only.
   - Strings via `useTranslation()`; add keys to **both** `src/i18n/locales/en.json` and `uk.json` under a `[name]` namespace.
   - Server data via a React Query hook in `src/hooks/query/` (`use[Resource]Query`) using `fetcher(api.x())` — create the `api` method and types in `src/types/api.ts` if missing.
   - Zustand via selectors only.

3. **Barrels** — `index.ts` in every folder; feature `index.ts` exports the screens.

4. **Route file** in `src/app/` — only:

   ```tsx
   import { [Name]Screen } from '@/features/[name]';
   export default [Name]Screen;
   ```

   Signed-in screens go under `src/app/(app)/`; public ones next to `sign-in.tsx`.

5. **Tests** — optional for screens; add one in `__tests__/features/[name]/` if the screen is a critical flow. Use `render` from `@tests/test-utils`, query by role/text.

6. **Verify** — `yarn type-check && yarn lint && yarn test`. Report results; do not commit.
