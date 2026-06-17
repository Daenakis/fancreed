---
name: setup
description: First-time setup of a new app from this React Native / Expo template. Walks through replacing all placeholder values, configuring environment files, and verifying the project is ready to build.
---

# First-Time App Setup

Follow these steps in order. Every placeholder listed here exists in the repo — verify each one before moving on.

---

## Step 1 — Install dependencies

```bash
yarn install
```

---

## Step 2 — Copy the environment file

```bash
cp .env.example .env
```

Open `.env` and fill in the four variables:

| Variable                      | Description                                    |
| ----------------------------- | ---------------------------------------------- |
| `EXPO_PUBLIC_RUN_MODE`        | `dev` / `stg` / `prod`                         |
| `EXPO_PUBLIC_API_URL`         | Your API base URL                              |
| `EXPO_PUBLIC_BUGSNAG_API_KEY` | BugSnag API key (leave empty to disable)       |
| `STRICT_ENV_VALIDATION`       | `true` to enable Zod env check before prebuild |

---

## Step 3 — Replace app identity placeholders in `env.ts`

File: `env.ts`

These constants are defined near the top of the file and default to `testexpo-owner` / `com.testexpoowner.*`. Replace them with your real values:

| Symbol                           | Current placeholder                                    | What to set                                |
| -------------------------------- | ------------------------------------------------------ | ------------------------------------------ |
| `BUNDLE_IDS` (all three entries) | `com.testexpoowner.dev` / `.stg` / `com.testexpoowner` | Your iOS bundle IDs per environment        |
| `PACKAGES` (all three entries)   | `com.testexpoowner.dev` / `.stg` / `com.testexpoowner` | Your Android package names per environment |
| `SCHEMES` (all three entries)    | `testexpo-owner` / `testexpo-owner.stg`                | Your custom URL scheme per environment     |
| `NAME`                           | `'testexpo-owner'`                                     | Your app display name                      |

Example after replacing:

```ts
const BUNDLE_IDS = {
  dev: 'com.acme.myapp.dev',
  stg: 'com.acme.myapp.stg',
  prod: 'com.acme.myapp',
} as const;

const PACKAGES = {
  dev: 'com.acme.myapp.dev',
  stg: 'com.acme.myapp.stg',
  prod: 'com.acme.myapp',
} as const;

const SCHEMES = {
  dev: 'myapp',
  stg: 'myapp.stg',
  prod: 'myapp',
} as const;

const NAME = 'My App';
```

---

## Step 4 — Replace app identity placeholders in `app.config.ts`

File: `app.config.ts`

Two constants are defined at the top, both marked with `// ⚠️ REPLACE`:

| Symbol               | Current placeholder     | What to set                              |
| -------------------- | ----------------------- | ---------------------------------------- |
| `EXPO_ACCOUNT_OWNER` | `'your-expo-username'`  | Your Expo account username               |
| `EAS_PROJECT_ID`     | `'your-eas-project-id'` | Your EAS project ID (obtained in Step 6) |

Also update the `slug` field on the `ExpoConfig` object:

| Field  | Current placeholder | What to set                                      |
| ------ | ------------------- | ------------------------------------------------ |
| `slug` | `'your-app-slug'`   | Your app slug (lowercase, hyphens — matches EAS) |

---

## Step 5 — Replace API URL placeholders in `eas.json`

File: `eas.json`

The `development`, `preview`, and `production` build profiles each contain:

```json
"EXPO_PUBLIC_API_URL": "https://api.placeholder.com"
```

Replace `https://api.placeholder.com` with your real API URL in all three profiles. (The `development-simulator` profile inherits from `development`, so it's covered automatically.)

---

## Step 6 — Create the EAS project and link it

```bash
# Install EAS CLI globally if not already installed
npm install -g eas-cli

# Log in to your Expo account
eas login

# Initialize the project — creates/links it on Expo servers
# Run this from the project root after updating app.config.ts (Step 4)
eas init
```

`eas init` will print your EAS project ID. Copy it back into `app.config.ts` as `EAS_PROJECT_ID`.

---

## Step 7 — (iOS App Store submissions only) Set `ascAppId` in `eas.json`

File: `eas.json`, under `submit.production.ios`:

```json
"ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID"
```

Replace `YOUR_APP_STORE_CONNECT_APP_ID` with your numeric App Store Connect app ID.
Skip this step if you are not submitting to the App Store.

---

## Step 8 — Verify the project health

```bash
# Check for Expo SDK / dependency mismatches
npx expo-doctor

# Confirm TypeScript compiles cleanly
yarn type-check
```

Both commands should exit with no errors before you run a native build.

---

## Step 9 — Run a first native build

Generate native folders (required once, and again after changing native deps):

```bash
yarn prebuild:clean
```

Then start the app:

```bash
yarn ios        # iOS Simulator
# or
yarn android:setup && yarn android   # Android (android:setup only needed once)
```

After the first build, `yarn start` connects to the dev client automatically — no rebuild needed unless you change native dependencies.

---

## Checklist

- [ ] `.env` created from `.env.example` with real values
- [ ] `env.ts`: `BUNDLE_IDS`, `PACKAGES`, `SCHEMES`, `NAME` updated
- [ ] `app.config.ts`: `EXPO_ACCOUNT_OWNER`, `EAS_PROJECT_ID`, `slug` updated
- [ ] `eas.json`: `EXPO_PUBLIC_API_URL` replaced in all three build profiles
- [ ] `eas.json`: `ascAppId` set (if submitting to App Store)
- [ ] `eas login` done, `eas init` run
- [ ] `npx expo-doctor` passes
- [ ] `yarn type-check` passes
- [ ] First native build succeeds
