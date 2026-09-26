# CLAUDE.md

Production-grade Expo SDK 57 / React Native 0.86 template — file-based routing (Expo Router), Unistyles v3 styling, React Query v5 server state, Zustand v5 client state, Zod v4 schemas, React Hook Form, MMKV storage, SecureStore for tokens, i18next localization, BugSnag error tracking.

> Node >= 22. Uses a Dev Client — **Expo Go will not work** (MMKV, Unistyles v3, Reanimated, BugSnag require native modules).

---

## Key Commands

| Command                    | What it does                                                      |
| -------------------------- | ----------------------------------------------------------------- |
| `yarn start`               | Start Metro dev server (connects to Dev Client)                   |
| `yarn lint`                | Run ESLint + folder structure check                               |
| `yarn check:structure`     | Check component folders (Name.tsx + index.ts + types.ts)          |
| `yarn type-check`          | TypeScript check, no emit                                         |
| `yarn test`                | Run Jest tests                                                    |
| `yarn test:watch`          | Jest in watch mode                                                |
| `yarn test:coverage`       | Jest with coverage report                                         |
| `yarn e2e`                 | Maestro E2E smoke flow (needs Maestro CLI + a running Dev Client) |
| `yarn format`              | Prettier over `*.ts/tsx` in `src/` and `__tests__/`               |
| `yarn prebuild`            | Generate `ios/` and `android/` from config                        |
| `yarn prebuild:clean`      | Full clean regeneration of native folders                         |
| `yarn ios`                 | Build and run on iOS Simulator                                    |
| `yarn android`             | Build and run on Android Emulator                                 |
| `yarn android:setup`       | Create `android/local.properties` (first-time Android setup)      |
| `yarn eas:dev:ios`         | EAS dev client build for iOS device                               |
| `yarn eas:dev:android`     | EAS dev client build for Android device                           |
| `yarn eas:dev:simulator`   | EAS dev client build for iOS Simulator                            |
| `yarn eas:preview:ios`     | EAS staging build for iOS                                         |
| `yarn eas:preview:android` | EAS staging build for Android                                     |
| `yarn eas:prod:ios`        | EAS production build for iOS                                      |
| `yarn eas:prod:android`    | EAS production build for Android                                  |

---

## Architecture Conventions

### Route files stay thin

`src/app/` files contain **only** a default export that re-exports a screen from `src/features/`:

```tsx
// src/app/(app)/posts/index.tsx
import { PostsScreen } from '@/features/posts';
export default PostsScreen;
```

No logic, no hooks, no JSX in route files.

### Feature module layout

```
src/features/[name]/
├── screens/[Name]Screen/   # Screen entry points
├── components/[Name]/      # Feature-specific UI
├── hooks/                  # (optional) feature-local hooks
├── types.ts                # (optional) shared feature types
└── index.ts                # Barrel re-export
```

Feature-local hooks live in `features/[name]/hooks/`; promote to `src/hooks/` only when reused across features.

### Component = folder

Every component (in features, ui/components, anywhere) is a folder:

```
ComponentName/
├── ComponentName.tsx
├── types.ts        # Props and local enums — never inline in the .tsx
└── index.ts        # Barrel re-export
```

Exactly these three files — no `styles.ts`, stories, or subfolders. Small sub-components live inside `ComponentName.tsx`. Screens may omit `types.ts` when they take no props. Enforced by `yarn check:structure` (part of `yarn lint` and pre-commit).

### Barrel re-exports

Every folder has an `index.ts`. Import from the barrel, not from the implementation file.

### Types location

| Scope                              | Location                         |
| ---------------------------------- | -------------------------------- |
| Global API contracts, shared enums | `src/types/`                     |
| Component props, local enums       | `types.ts` next to the component |
| Shared between feature components  | `features/[name]/types.ts`       |

### Styling — Unistyles v3 only

Never use `StyleSheet` from `react-native`. Use `StyleSheet` from `react-native-unistyles`:

```tsx
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing(4),
  },
}));
```

Colors, spacing, and radius always come from `theme.*` — never hardcoded. Theme config lives in `src/ui/theme/` (`colors.ts`, `fonts.ts`, `metrics.ts`, `unistyles.ts`).

### Text — always `<Text>` from `@/ui/components`

Never use `Text` from `react-native` (ESLint-enforced). The UI `Text` applies the Figma typography scale (Inter) and a theme colour:

```tsx
<Text variant="h1Semibold" accessibilityRole="header">{t('title')}</Text>
<Text variant="bodyMRegular" color="mutedForeground">{t('caption')}</Text>
```

`variant` = key of `theme.typography` (default `bodyLRegular`), `color` = theme colour token (default `foreground`). Never set `fontWeight` or `fontSize` by hand — weight comes from the font family; add a new variant to `src/ui/theme/fonts.ts` if Figma introduces one.

### Zustand — selectors only

Never subscribe to the whole store. Always use a selector:

```ts
const token = useAuthStore((s) => s.accessToken); // single field
const { accessToken, signOut } = useAuthStore(
  useShallow((s) => ({ accessToken: s.accessToken, signOut: s.signOut })),
); // multiple fields
```

One store per file: `use[Name]Store.ts` in `src/store/`.

### React Query — one hook per resource

Hook files live in `src/hooks/query/<group>/` (one folder per apidoc group), named `use[Resource]Query.ts` or `use[Action]Mutation.ts`, each exporting its `queryOptions`/`mutationOptions` too. Endpoints live in `src/api/endpoints/<group>.ts`.
Always wrap API calls with `fetcher()` from `@/api` to unwrap `AxiosResponse<T>` → `T`:

```ts
import { authApi, fetcher } from '@/api';
mutationFn: (params: LoginRequest) => fetcher(authApi.login(params)),
```

### Environment access

- **App code**: import `CONFIG` from `@/config` — never `process.env`
- **`app.config.ts` / `env.ts` only**: import `Env` from `env.ts`
- `process.env` is blocked everywhere else by an ESLint rule (`no-restricted-syntax`)

### Token storage

Auth tokens (access + refresh) live in **SecureStore** (iOS Keychain / Android Keystore) via `@/utils/secureToken`. MMKV is for non-sensitive persistence (theme, language, UI prefs).

### Forms

Use `zodResolver` from `@hookform/resolvers/zod` (v5.1+ supports Zod v4). Define schemas in `src/schemas/`, infer types with `z.infer<>`.

### Imports order (ESLint-enforced)

`simple-import-sort` enforces: side effects → node builtins → external packages → `@/ui` → `@/hooks` → `@/providers` → `@/utils` → `@/api` → `@/store` → `@/types` → `@/constants` → `@/schemas` → `@/config` → `@/` other → relative.

---

## Testing

Jest 30 + React Native Testing Library. Tests live under `__tests__/`, mirroring `src/` structure.

**Required:** every `src/utils/` function and every `src/ui/components/` component must have a test.

**Recommended (not required):** critical screens (auth, onboarding, checkout), non-trivial Zustand stores.

**Not tested:** Zod schemas, React Query hooks, route files, barrel files, theme/config.

Use `render` from `@tests/test-utils` (not from RNTL directly) — it wraps with QueryClient and other providers. Query by role/text, not by `testId`. Test name pattern: _what + when + expected result_.

Full conventions: `src/docs/testing.md`

**E2E:** a Maestro smoke flow lives in `.maestro/` — run with `yarn e2e` (requires the Maestro CLI and a running Dev Client). See `src/docs/e2e.md`.

---

## Commit Messages

Conventional Commits 1.0.0. Header max **150 characters**. Lowercase, imperative, no trailing period.
Types: `feat` `fix` `chore` `refactor` `docs` `style` `test` `perf` `build` `ci` `revert`

```
feat(auth): add sign in with Apple
fix(api): handle 401 on token refresh
```

Full rule: `.cursor/rules/conventional-commits.mdc`

---

## Git Hooks (husky)

- **pre-commit** (lint-staged): ESLint --fix + Prettier on staged `*.ts/tsx/js/jsx/json/md`
- **pre-push**: `yarn type-check && yarn test` — both must pass before push

---

## Working in this repo (for Claude)

Project-specific rules learned the hard way. Personal preferences (git, reply style) live in `~/.claude/CLAUDE.md`.

- **Verify before "done":** `yarn type-check`, `yarn lint`, `yarn test` must pass. For native-affecting changes (entry file, config plugins, fonts, bundle ids) also run `npx expo export --platform ios` — and say that it wasn't checked on a device.
- **Dependencies:** never remove a package because `src/` doesn't import it. Check `peerDependencies` of installed packages first — BugSnag needs netinfo, expo-crypto, expo-file-system, expo-application, expo-device; Unistyles uses react-native-edge-to-edge.
- **Icons:** generate with `yarn icons` (never hand-write SVG components). Some icons are hand-edited after generation (`Lion.tsx`) — never run `yarn icons --force` without asking.
- **Fonts:** keep `useFonts` in `useAppReady`. The font files' PostScript names are `Inter18pt-*`; iOS only finds embedded fonts by that name, `useFonts` registers the `Inter-*` names the theme uses.
- **Backend:** `https://app.fancreed.com/api/`, contract in the apidoc (`/apidoc`, credentials from Denis — never commit them). Auth is email-only, single JWT (no refresh), email activation with a 4-digit code. See `src/docs/api.md` for how requests are organised. Field validation in `src/schemas/authFields.ts` mirrors the apidoc regexes.
- **Placeholders still open:** EAS project id (`app.config.ts`), `ascAppId` (`eas.json`).
- **Autonomy:** run commands, installs and checks yourself without asking. Stop and ask Denis only for important/hard changes (breaking behaviour, visible UI change, new npm packages that add functionality, anything outward-facing).
- **Committing:** stage with `git add -A <folder>` (never list paths that may already be deleted — one bad path makes the whole `git add` fail silently in a chain) and check `git status` is clean for the intended files before pushing.
- **Workflows:** use the project skills — `/migrate-component`, `/new-feature`, `/new-component`, `/migrate-screen`, `/review`, `/setup`.

### Migration from the old app (Denis's rules)

- **Old project:** `~/Documents/ruhOld` (sibling of this repo `~/Documents/fancreed`; RN 0.63) — the old app we take components from. **READ-ONLY**. Only read it; never modify, format, install or run anything that changes it.
- **Scope:** migrate only the components Denis names in his message (currently one per request). Never pick extras.
- **Structure is protected:** every component is exactly `Name.tsx` + `index.ts` + `types.ts` (every component has props). Sub-components that aren't worth their own folder live inside `Name.tsx`. Enforced by `yarn check:structure` (runs in `yarn lint` and pre-commit).
- **No Storybook** — never migrate stories, `.storybook/`, or story-only code.
- **Props** stay as in the old component; list and justify any change. Data comes via our backend, not api-football directly — the api-football v3 docs check is deferred.
- **Styles:** map old hardcoded values to the closest theme token; list every non-exact match. Ask when the look would change noticeably.
- **New npm packages** require Denis's approval — ask first.
- **Tests** for every migrated component, following best practices in `src/docs/testing.md`.
- **Visual check:** only on Denis's booted iOS simulator via Maestro (`~/.maestro/bin/maestro`). Temporarily replace the SignInScreen content with the component demo (no login/navigation steps), exercise every prop, screenshot, then restore it. **Copy the file to the scratchpad first and restore from that copy** — `git checkout` drops uncommitted work in it. If edits stop showing up, Metro's file watcher is stale: ask Denis to restart `yarn start`. Light mode only — skip dark mode. Run `maestro --device <booted sim id> test` (another device is connected). Don't relaunch the app: keep it running, edit the file and let Fast Refresh reload it (or reload JS); flows start straight at the screen, no `launchApp`. Only if the app isn't running: `launchApp` (no `clearState`), tap `http://.*:8081`, then optional `Continue` and `Close` on the dev menu. Tap a non-input element to dismiss the keyboard (`hideKeyboard` fails on iOS). Screenshots: `xcrun simctl io <sim id> screenshot`, then `sips -Z 500`; tile several into one image before viewing. Full JS reload (e.g. to replay an intro): `curl -X POST http://localhost:8081/reload` only fast-refreshes — state survives. Say what couldn't be checked.
- **Save tokens:** minimal reads/output — `grep`/`sed -n` over full files, `tail` command output, downscale screenshots (`sips -Z 800`) before viewing, no extra verification loops.
- **Merge duplicates, optimise when needed:** if a component duplicates one we already have (or another old one), fold it into a single component with variants instead of adding a new one (e.g. Button covers the old Button, CreateButton and AuthButton). Improve old code where it's clearly worse (magic numbers, raw data props, screen-% widths, missing a11y) — list what changed and why.
- **Ask Denis** only when a decision is critical (visible look change, prop/API change, new package); otherwise decide and list it.

## Reference Docs

| File                                     | What it covers                                                                         |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| `src/docs/features.md`                   | Feature module structure and conventions                                               |
| `src/docs/api.md`                        | Axios instance, `fetcher()`, auth interceptors (token + refresh-on-401), session flow  |
| `src/docs/hooks-query.md`                | React Query hook conventions, `fetcher()` usage, query key enums                       |
| `src/docs/store.md`                      | Zustand store conventions, `useShallow` for multi-field selectors                      |
| `src/docs/schemas.md`                    | Zod schema conventions, `zodResolver` for RHF                                          |
| `src/docs/ui-components.md`              | UI component workflow: primitives vs components, Unistyles v3                          |
| `src/docs/testing.md`                    | Full testing conventions, folder structure, examples                                   |
| `src/docs/e2e.md`                        | Maestro E2E setup and how to run the smoke flow                                        |
| `src/docs/deep-linking.md`               | Deep linking setup (placeholder — fill in when domain is set)                          |
| `.cursor/rules/rn-primitives.mdc`        | Step-by-step AI workflow for adding UI components (rn-primitives + rnr → Unistyles v3) |
| `.cursor/rules/conventional-commits.mdc` | Commit message format reference                                                        |
