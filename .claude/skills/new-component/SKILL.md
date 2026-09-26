---
name: new-component
description: Create a reusable UI component in src/ui/components (or a feature component) as a folder with Component.tsx, types.ts, index.ts and the required test, styled with Unistyles v3 theme tokens. Use when the user asks for a Button, Input, Card, etc.
---

# New Component

Input: component name, variants/states, and ideally a Figma screenshot. If states (pressed, disabled, loading, error) or sizes are unclear from the design, **ask before coding**.

Read `src/docs/ui-components.md` and `.cursor/rules/rn-primitives.mdc` (source-of-truth workflow for rn-primitives / reactnativereusables). Use `src/ui/components/Text/` as the reference implementation.

## Decide where it lives

- Used across features → `src/ui/components/[Name]/` (**test required**)
- Used by one feature only → `src/features/[feature]/components/[Name]/` (test optional)

First check `src/ui/components/index.ts` — don't duplicate an existing component.

## Files

```
[Name]/
├── [Name].tsx   # component + StyleSheet at the bottom
├── types.ts     # props (never inline in .tsx)
└── index.ts     # export { [Name] } + export type { [Name]Props }
```

Add it to `src/ui/components/index.ts`.

## Rules

- `StyleSheet` from `react-native-unistyles` only; every colour/spacing/radius from `theme.*`. Use dynamic style functions (`styles.root(variant)`) for variants — see `Text.tsx`.
- Text inside via `Text` (`variant` + `color` token); icons via `Icon`.
- Props: extend the RN props of the wrapped element; accept `style` and merge last: `style={[styles.root, style]}`.
- React 19: accept `ref` as a normal prop (typed in `types.ts`), no `forwardRef`.
- Set `[Name].displayName = '[Name]'`.
- Accessibility: correct `accessibilityRole`, `accessibilityState` (disabled/selected), labels for icon-only buttons.
- Show it on the Playground screen if it's a design-system component.

## Test (`__tests__/ui/[Name].test.tsx`)

`render` from `@tests/test-utils`; query by role/text; names = what + when + expected. Cover each variant/state and each callback (called / not called when disabled).

## Verify

`yarn type-check && yarn lint && yarn test`. Report results; do not commit.
