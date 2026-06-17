# UI Components

Inspired by [React Native Reusables](https://reactnativereusables.com/) and the shadcn/ui philosophy — you own every file, no UI packages installed.

## Two folders

```
src/ui/
├── primitives/   ← headless skeletons, no styles
└── components/   ← styled, ready-to-use components
```

### `primitives/`

Headless components — behavior and accessibility only, no styles. Source: [rnprimitives.com](https://rnprimitives.com/) — component source is copy-pasted directly from there.

Shared utilities (`@rn-primitives/slot`, `@rn-primitives/types`) can be installed as npm packages — they are small and not UI components. The components themselves (checkbox, dialog, switch...) are copy-pasted source only, never installed as a package.

### `components/`

The main folder. All project components live here. Using `primitives/` is not required — a component can be written from scratch or taken from [reactnativereusables.com](https://reactnativereusables.com/).

**One hard rule:** styling via [Unistyles v3](https://unistyl.es/v3/start/getting-started/) only. Styles must rely on theme tokens (`theme.colors.*`, `theme.spacing.*`, `theme.radius.*`) so that switching themes updates the entire UI without touching components.

## Conventions

| Rule              | Description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| Unistyles v3 only | `StyleSheet.create((theme) => ({...}))` at the bottom of the file |
| Theme tokens      | Colors, spacing, radius — always from `theme.*`, never hardcoded  |
| Merge style prop  | `style={[styles.root, style]}` — never override external styles   |
| `forwardRef`      | Required for components wrapping a primitive                      |
| `displayName`     | Always set                                                        |

## Working with AI (Cursor)

The project has a Cursor rule: `.cursor/rules/rn-primitives.mdc`.

It tells the AI what to do when you ask to add a component:

- check if it already exists in `primitives/` and `components/`
- if not — find the current source on [rnprimitives.com](https://rnprimitives.com/) or [reactnativereusables.com](https://reactnativereusables.com/)
- adapt to Unistyles v3 (remove NativeWind / className)
- install minimum deps at exact versions
- if a design screen is attached — study all states, ask about anything unclear, then write code

**The rule activates automatically** when any file from `src/ui/**/*.tsx` is open.

**From anywhere else** — add `@rn-primitives` to the start of your message:

```
@rn-primitives Add a Checkbox.
```

```
@rn-primitives Add a Button with variants: default, destructive, ghost.
[attach design screen]
Ask me if anything is unclear before coding.
```

## References

- [rn-primitives](https://rnprimitives.com/) — headless source for `primitives/`
- [React Native Reusables](https://reactnativereusables.com/) — source for `components/`
- [Unistyles v3](https://unistyl.es/v3/start/getting-started/) — styling system
