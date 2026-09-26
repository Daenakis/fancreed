---
name: migrate-component
description: Migrate a UI component from the old fancreed app (read-only) into this codebase with the strict Name.tsx + index.ts + types.ts structure, theme tokens, and tests. Use when the user names a component to transfer from the old project.
---

# Migrate Component

Denis names the component(s) to migrate — **only migrate what he named**. Currently one component per request; he'll raise it to 3–4 later. Don't pick extra components on your own; if the named one depends on another unmigrated component, stop and ask.

## Hard rules

1. **Old project is READ-ONLY.** Only read it (Read, `cat`, `grep`, `ls`, `git log`). Never write, move, delete, format, install or run scripts/git commands that change anything there. (Path: see "Old project" in CLAUDE.md.)
2. **No Storybook.** Ignore `*.stories.*`, `.storybook/`, story-only props, decorators and mock data. Never bring any of it over.
3. **Strict folder structure** — exactly three files, nothing else:
   ```
   [Name]/
   ├── [Name].tsx   # component + StyleSheet (Unistyles) at the bottom
   ├── types.ts     # props — every component has props
   └── index.ts     # export { [Name] } from './[Name]'; export type { [Name]Props } from './types';
   ```
   No `styles.ts`, `constants.ts`, `utils.ts`, subfolders or second components.
   **Sub-components** (small parts with no reason to exist on their own) are unexported functions inside `[Name].tsx`, with their props in the same `types.ts`. If a part is reused elsewhere, it's a real component → ask first.
4. **Props stay the same as the old component** (names, types, optionality, defaults) unless there's a clear reason. Any change → list it and explain why. Data comes through our backend (not api-football directly) — don't rename fields to match api-football docs; that check is deferred.
5. **New npm packages require Denis's approval.** If the old component uses a library we don't have, stop and ask (name, why, alternatives, native or JS-only).
6. **Styling:** Unistyles v3 + theme tokens only. Map old hardcoded colours/sizes to the closest `theme.colors.*`, `theme.spacing()`, `theme.radius.*`, `Text` `variant`. List every value that had no exact match (old value → token used) so Denis can check. Ask when the choice changes the look noticeably.

## Where it goes

- Used by several features in the old app → `src/ui/components/[Name]/` (test required, add to `src/ui/components/index.ts`)
- Used by one feature → `src/features/[feature]/components/[Name]/`

## Steps

1. **Read** the old component, its styles, types, and everything it imports. Find where it's used (to decide location and to see real props).
2. **Report before writing** (short): what it does, its props, dependencies, unmigrated child components, libraries, style values without a token, anything odd or buggy.
   Ask about blockers; otherwise continue.
3. **Write** the three files. Conventions:
   - Text via `Text` (`variant` + `color`), icons via `Icon`, strings via i18n (both `en.json` and `uk.json`).
   - Extend the wrapped RN element's props where it makes sense; merge `style` last.
   - React 19: `ref` as a normal prop, no `forwardRef`. Set `displayName`.
   - Accessibility: role, state (disabled/selected), labels for icon-only buttons.
   - Keep behaviour identical; flag old bugs instead of silently fixing them.
4. **Test** — `__tests__/ui/[Name].test.tsx` (shared) or `__tests__/features/[feature]/[Name].test.tsx`. `render` from `@tests/test-utils`, query by role/text, names = what + when + expected. Cover each variant/state, callbacks, disabled.
5. **Verify** — `yarn type-check && yarn lint && yarn test` (lint includes the structure check).
6. **Report** (short, lead-level): files created, prop changes (if any), token mapping table for unmatched values, open questions, what wasn't checked on a device. **Do not commit.**
