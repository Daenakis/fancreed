# React Native Template

Expo-based React Native template with TypeScript, file-based routing, and a scalable modular architecture.

## Tech Stack

| Category       | Technology                      |
| -------------- | ------------------------------- |
| Framework      | React Native 0.81 + Expo SDK 54 |
| Language       | TypeScript (strict mode)        |
| Navigation     | Expo Router (file-based)        |
| Styling        | Unistyles v3 (C++ engine)       |
| Server State   | TanStack React Query v5         |
| Client State   | Zustand v5                      |
| Validation     | Zod v4                          |
| HTTP Client    | Axios                           |
| Forms          | React Hook Form v7              |
| Storage        | MMKV                            |
| Animations     | Reanimated v4                   |
| Error Tracking | BugSnag                         |
| Build          | EAS Build + local prebuild      |

## Quick Start

### Prerequisites

- Node.js >= 22 (see `.nvmrc`)
- Yarn
- [EAS CLI](https://docs.expo.dev/build/setup/) (`npm install -g eas-cli`)
- macOS: Xcode + CocoaPods (for iOS builds)
- Android Studio + JDK 17 (for Android builds)

### Installation

```bash
yarn install
```

### Environment Setup

Copy the example env file and fill in the values:

```bash
cp .env.example .env
```

| Variable                      | Description                                  | Example                   |
| ----------------------------- | -------------------------------------------- | ------------------------- |
| `EXPO_PUBLIC_RUN_MODE`        | App environment                              | `dev` / `stg` / `prod`    |
| `EXPO_PUBLIC_API_URL`         | API base URL                                 | `https://api.example.com` |
| `EXPO_PUBLIC_BUGSNAG_API_KEY` | BugSnag API key for error reporting          | `abc123...`               |
| `STRICT_ENV_VALIDATION`       | Enable strict Zod validation before prebuild | `true` / `false`          |

## Running the App

### Development (Dev Client)

> This app relies on native modules (MMKV, Unistyles v3, Reanimated, BugSnag) that are **not available in Expo Go**. Build a Dev Client first (see [Native Build](#native-build-dev-client) below) — `yarn start` then connects to it automatically.

```bash
yarn start          # Start Metro dev server (connects to the Dev Client)
```

### Native Build (Dev Client)

Requires prebuild to generate native projects first:

```bash
yarn prebuild        # Generate ios/ and android/ folders
yarn prebuild:clean  # Full regeneration from scratch (recommended)
```

Then run on device/emulator:

```bash
yarn ios             # Build and run on iOS Simulator
yarn android:setup   # (Android only) Create local.properties with SDK path
yarn android         # Build and run on Android Emulator
```

After the first native build, `yarn start` will use the dev client automatically — no need to rebuild unless you change native dependencies.

## Building for Release

### Local Builds

#### iOS (requires macOS + Xcode)

```bash
yarn ios:release     # Build Release .app for Simulator
```

For a signed `.ipa` (App Store / TestFlight):

1. Open `ios/` folder in Xcode
2. **Product → Archive**
3. **Distribute App** → choose destination

#### Android

If you get "SDK location not found", run `yarn android:setup` first.

```bash
yarn android:setup         # Create local.properties with SDK path (if needed)
yarn android:release       # Build .apk (for direct install / testing)
yarn android:release:aab   # Build .aab (for Google Play)
```

Output locations:

| Format | Path                                        |
| ------ | ------------------------------------------- |
| `.apk` | `android/app/build/outputs/apk/release/`    |
| `.aab` | `android/app/build/outputs/bundle/release/` |

> For production Android builds, you need a signing keystore. See [Android signing docs](https://developer.android.com/studio/publish/app-signing).

### EAS Build (Cloud)

EAS Build compiles native projects in the cloud — no local Xcode or Android SDK required for iOS/Android builds.

#### Initial Setup (one time)

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Log in to your Expo account
eas login
```

Before initializing, update `app.config.ts` with your real values:

- `EXPO_ACCOUNT_OWNER` — your Expo account username
- `EAS_PROJECT_ID` — your Expo project ID

```bash
# 3. Initialize the project (links to Expo servers)
eas init
```

#### Build Profiles

Configured in `eas.json`:

| Profile                 | Purpose                       | Env    | Distribution |
| ----------------------- | ----------------------------- | ------ | ------------ |
| `development`           | Dev client on physical device | `dev`  | internal     |
| `development-simulator` | Dev client on iOS Simulator   | `dev`  | internal     |
| `preview`               | Staging build for testers     | `stg`  | internal     |
| `production`            | Release build for app stores  | `prod` | store        |

#### Build Commands

```bash
# Development builds
yarn eas:dev:ios            # Dev client → physical iPhone
yarn eas:dev:android        # Dev client → physical Android
yarn eas:dev:simulator      # Dev client → iOS Simulator

# Preview / Staging builds
yarn eas:preview:ios        # Staging build → iOS (internal)
yarn eas:preview:android    # Staging build → Android .apk (internal)

# Production builds
yarn eas:prod:ios           # Production → iOS .ipa
yarn eas:prod:android       # Production → Android .aab
```

#### Publishing to Stores

##### Build + auto-submit

```bash
yarn eas:prod:ios:submit       # Build iOS + upload to App Store Connect
yarn eas:prod:android:submit   # Build Android + upload to Google Play
```

## Project Structure

```
src/
├── api/            # Axios instance and API methods
├── app/            # Expo Router — thin route files only
├── config/         # App config (env values, query defaults)
├── constants/      # Shared constants (storage keys, etc.)
├── features/       # Business features (screens, feature components, local hooks)
├── hooks/          # Global custom hooks
│   ├── app/        # App lifecycle hooks (ready, focus, online)
│   └── query/      # React Query hooks (fetch, mutate)
├── utils/          # Utilities (storage, env validation, adapters)
├── providers/      # React context providers
├── schemas/        # Zod schemas for runtime validation
├── store/          # Zustand stores (client state)
├── types/          # Global TypeScript types, enums, API contracts
└── ui/
    ├── assets/     # Icons (SVG), images, fonts
    ├── components/ # Reusable atomic UI components
    └── theme/      # Unistyles config, colors, fonts, metrics
```

### Features (`src/features/`)

Each feature is a self-contained module with screens, components, and optional local hooks. Route files in `src/app/` stay thin — they only import and re-export screen components from features. See `src/docs/features.md` for full conventions.

```
features/posts/
├── screens/            # Screen components (entry points)
│   └── PostsScreen/
├── components/         # Feature-specific UI components
│   └── PostCard/
├── hooks/              # (optional) Feature-local hooks
├── types.ts            # (optional) Shared feature types
└── index.ts
```

### Component Structure

Every component (in `features/`, `ui/components/`, anywhere) is a **folder**:

```
ComponentName/
├── ComponentName.tsx
├── types.ts            # Props, local enums (or ComponentName.types.ts)
└── index.ts            # Barrel re-export
```

Types are always extracted into a separate file next to the component, never inline.

### State Management

| What                                       | Where           |
| ------------------------------------------ | --------------- |
| Server data (API responses, cache)         | React Query     |
| Client state (UI, auth token, preferences) | Zustand         |
| Form state                                 | React Hook Form |
| Persistent storage                         | MMKV            |

### Styling (Unistyles v3)

All components use [Unistyles v3](https://unistyl.es/) — a C++ styling engine with zero re-renders on theme/breakpoint changes. Replace `StyleSheet` from `react-native` with `StyleSheet` from `react-native-unistyles`:

```tsx
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing(4),
  },
}));
```

Theme configuration lives in `src/ui/theme/`:

| File           | Contents                               |
| -------------- | -------------------------------------- |
| `colors.ts`    | Light and dark color palettes          |
| `fonts.ts`     | Font sizes and weights                 |
| `metrics.ts`   | `spacing()`, `radius`, `breakpoints`   |
| `unistyles.ts` | Unistyles config and type declarations |

On first launch the theme follows the device color scheme. Once the user picks a theme manually (via `useTheme().setTheme`), the choice is persisted in MMKV and used on subsequent launches.

Docs: [Unistyles v3](https://unistyl.es/v3/start/getting-started) · [Theming](https://unistyl.es/v3/guides/theming) · [Dynamic Functions](https://unistyl.es/v3/references/dynamic-functions)

### Localization (i18n)

Translation files live in `src/i18n/locales/`. Supported languages are declared in `src/i18n/resources.ts`. The resolved language is persisted in MMKV so the user's choice survives restarts. Switch language at runtime with `useLanguage().changeLanguage(lng)`.

> **RTL:** RTL direction switching is not enabled — no RTL languages are configured yet. When adding an RTL language (e.g. Arabic, Hebrew), uncomment the direction logic in `src/i18n/index.ts` and `src/hooks/useLanguage.ts`. Direction changes require a JS reload; use `expo-updates` for an OTA reload or prompt the user to restart manually.

### SVG Icons

SVGs are imported as React components via `react-native-svg-transformer`. Use the `<Icon>` component with the icon registry in `src/ui/assets/icons/`.

## Testing

Jest + React Native Testing Library. See `src/docs/testing.md` for full conventions.

| Priority     | What                                 | Type             |
| ------------ | ------------------------------------ | ---------------- |
| **Required** | Utilities (`src/utils/`)             | Unit             |
| **Required** | UI components (`src/ui/components/`) | Unit / Component |
| Recommended  | Critical screens (auth, checkout)    | Integration      |
| Recommended  | Zustand stores (non-trivial logic)   | Unit             |

```bash
yarn test              # Run all tests
yarn test:watch        # Watch mode
yarn test:coverage     # Coverage report
```

## Code Quality & Git Hooks

### Pre-commit (husky + lint-staged)

On every `git commit`, staged files are automatically processed:

| File pattern  | Actions                             |
| ------------- | ----------------------------------- |
| `*.{ts,tsx}`  | `eslint --fix` → `prettier --write` |
| `*.{js,jsx}`  | `eslint --fix` → `prettier --write` |
| `*.{json,md}` | `prettier --write`                  |

If ESLint finds errors it can't auto-fix, the commit is blocked.

Config: `.lintstagedrc.json`

### Pre-push (type-check + tests)

On every `git push`, the full quality gate runs before anything leaves your machine:

```bash
yarn type-check && yarn test
```

If either fails, the push is blocked. Lint stays fast at commit time (staged files only), while the slower project-wide checks run once per push. Config: `.husky/pre-push`

### Commit Message (commitlint)

All commit messages must follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(optional scope): <description>
```

Allowed types: `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test`, `perf`, `build`, `ci`, `revert`

```bash
# ✅ Good
feat(auth): add sign in with Apple
fix(api): handle 401 on token refresh
chore: update dependencies

# ❌ Bad
added new screen        # no type
feat: Added new screen. # past tense + period
```

Header max length: **150 characters**. Config: `commitlint.config.js`

## Conventions

| Rule                        | Description                                                        |
| --------------------------- | ------------------------------------------------------------------ |
| Thin route files            | `app/` only imports screens from `features/` — no logic            |
| Component = folder          | Every component is a folder with `.tsx`, `types.ts`, `index.ts`    |
| Types next to component     | Props and local enums in `types.ts` beside the component           |
| One store per file          | `use[Name]Store.ts` — see `src/docs/store.md`                      |
| One query hook per resource | `use[Resource]Query.ts` — see `src/docs/hooks-query.md`            |
| Re-export from index        | Every folder has an `index.ts` barrel file                         |
| Selectors only              | Never subscribe to the whole Zustand store                         |
| Typed routes                | All routes are type-safe via Expo Router                           |
| Feature-local hooks         | Keep in `features/[name]/hooks/`; move to `src/hooks/` when reused |

### Types Location

| Scope                             | Location                                          |
| --------------------------------- | ------------------------------------------------- |
| Global (API contracts, enums)     | `src/types/`                                      |
| Component props, local enums      | `types.ts` or `[Name].types.ts` next to component |
| Shared between feature components | `features/[name]/types.ts`                        |

### Accessibility

All interactive and semantic elements can include accessibility props. Use i18n keys for labels so screen readers work in every supported language.

| Prop                 | When to use                                                                | Example                                     |
| -------------------- | -------------------------------------------------------------------------- | ------------------------------------------- |
| `accessibilityRole`  | Every interactive or semantic element                                      | `"button"`, `"header"`, `"alert"`, `"link"` |
| `accessibilityLabel` | Buttons / icons without visible text, or when visible text is insufficient | `accessibilityLabel={t('auth.signIn')}`     |
| `accessibilityHint`  | When the action result isn't obvious from the label                        | `"Navigates to settings screen"`            |

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel={t('auth.signIn')}
  onPress={handleSignIn}
>
  <Text>…</Text>
</Pressable>
```

### Custom Fonts (Splash Screen)

If your app uses custom fonts, load them inside `useAppReady` (in `src/hooks/app/useAppReady.ts`) **before** the splash screen is hidden. This prevents a flash of unstyled text on launch.

```tsx
import * as Font from 'expo-font';

import { loadAuthFromStorage } from '@/store';

async function prepare() {
  await loadAuthFromStorage();

  await Font.loadAsync({
    'Inter-Regular': require('@/ui/assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('@/ui/assets/fonts/Inter-Bold.ttf'),
  });

  // ... prefetch, etc.
  setIsReady(true);
  SplashScreen.hideAsync();
}
```

Install the module: `npx expo install expo-font`

Docs: [expo-font](https://docs.expo.dev/versions/latest/sdk/font/)

### Splash Screen (Dark Mode)

The splash screen is configured via the `expo-splash-screen` plugin in `app.config.ts`. To show a different splash in dark mode, add a `dark` variant with its own background and image:

```ts
[
  'expo-splash-screen',
  {
    backgroundColor: '#2E3C4B',
    image: './assets/splash-icon.png',
    imageWidth: 150,
    dark: {
      backgroundColor: '#000000',
      image: './assets/splash-icon-dark.png',
    },
  },
],
```

> The template ships a single placeholder splash (`assets/splash-icon.png`). Replace it with real artwork, and add `splash-icon-dark.png` if you want a dark variant.

Docs: [expo-splash-screen](https://docs.expo.dev/versions/latest/sdk/splash-screen/)

### Images (expo-image)

For any app that renders remote images — especially in lists — [`expo-image`](https://docs.expo.dev/versions/latest/sdk/image/) is the recommended `Image` replacement. It is **not installed by default** (kept lean, like `expo-font` / `expo-updates`); add it when you need it:

```bash
npx expo install expo-image
```

Why it's preferred over the built-in React Native `Image`:

| Feature                          | `expo-image`                                 | RN `Image`              |
| -------------------------------- | -------------------------------------------- | ----------------------- |
| Configurable disk + memory cache | ✅ `cachePolicy` (default `disk`)            | ⚠️ limited, not tunable |
| Blurhash / thumbhash placeholder | ✅ `placeholder={{ blurhash }}`              | ❌                      |
| Fade-in transition               | ✅ `transition`                              | ❌                      |
| List recycling                   | ✅ `recyclingKey` (no stale image on scroll) | ❌                      |
| Modern formats (WebP/AVIF)       | ✅ native                                    | ⚠️ limited              |

```tsx
import { Image } from 'expo-image';

<Image
  source="https://example.com/photo.jpg"
  placeholder={{ blurhash }}
  contentFit="cover"
  transition={300}
  cachePolicy="memory-disk"
  style={{ width: 200, height: 200 }}
/>;
```

Docs: [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)

### OTA Updates (expo-updates)

For production apps, [expo-updates](https://docs.expo.dev/versions/latest/sdk/updates/) enables over-the-air JavaScript bundle updates — push bug fixes and minor changes without a full App Store / Google Play review cycle.

```bash
npx expo install expo-updates
```

Add the plugin to `app.config.ts`:

```ts
plugins: [
  // ... existing plugins
  'expo-updates',
],
```

Then configure an update URL in `eas.json` or use EAS Update:

```bash
eas update --branch production --message "fix: resolve crash on profile screen"
```

Docs: [EAS Update](https://docs.expo.dev/eas-update/introduction/) · [expo-updates](https://docs.expo.dev/versions/latest/sdk/updates/)

### Deep Linking

A custom URL scheme is already configured (`scheme` in `app.config.ts`), and Expo Router resolves deep links from the file-based routes out of the box. Universal Links (iOS) and App Links (Android) — the `https://` links that open the app — still need to be set up per project.

Setup guidance lives in [`src/docs/deep-linking.md`](src/docs/deep-linking.md) _(placeholder — to be filled in once the production domain and link strategy are decided)._

### Environment Validation

Environment variables are validated at build time via Zod schema (`src/schemas/env.ts`). Direct access to `process.env` is blocked by an ESLint rule — use `Env` from `env.ts` (for `app.config.ts`) or `CONFIG` from `@/config` (for app code) instead.

## All Scripts Reference

| Script                         | Description                                     |
| ------------------------------ | ----------------------------------------------- |
| `yarn start`                   | Start Metro dev server                          |
| `yarn lint`                    | Run ESLint                                      |
| `yarn type-check`              | TypeScript type check (no emit)                 |
| `yarn type-check:watch`        | TypeScript type check in watch mode             |
| `yarn format`                  | Prettier format `src/` and `__tests__/`         |
| `yarn prebuild`                | Generate native ios/ and android/ folders       |
| `yarn prebuild:clean`          | Clean regeneration of native folders            |
| `yarn android:setup`           | Create android/local.properties with SDK path   |
| `yarn ios`                     | Build and run on iOS Simulator (debug)          |
| `yarn android`                 | Build and run on Android (debug)                |
| `yarn ios:release`             | Local iOS release build                         |
| `yarn android:release`         | Local Android release .apk                      |
| `yarn android:release:aab`     | Local Android release .aab (Google Play)        |
| `yarn eas:dev:ios`             | EAS: dev client → iOS device                    |
| `yarn eas:dev:android`         | EAS: dev client → Android device                |
| `yarn eas:dev:simulator`       | EAS: dev client → iOS Simulator                 |
| `yarn eas:preview:ios`         | EAS: staging → iOS (internal)                   |
| `yarn eas:preview:android`     | EAS: staging → Android .apk (internal)          |
| `yarn eas:prod:ios`            | EAS: production → iOS .ipa                      |
| `yarn eas:prod:android`        | EAS: production → Android .aab                  |
| `yarn eas:prod:ios:submit`     | EAS: production iOS + submit to App Store       |
| `yarn eas:prod:android:submit` | EAS: production Android + submit to Google Play |
