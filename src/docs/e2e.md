# E2E Testing (Maestro)

[Maestro](https://maestro.mobile.dev/) is a mobile UI testing framework. Tests are plain YAML flows — no code required.

## Install

Maestro is a standalone CLI, not an npm package. Install it once on your machine:

```bash
curl -fsSL "https://get.maestro.mobile.dev" | bash
```

Verify: `maestro --version`

## Prerequisite

Maestro runs against a **Dev Client build** (built with `expo-dev-client`). Expo Go is not supported.

Start a simulator/emulator, install the dev build, then confirm the app is running before executing any flow.

## Run

```bash
# Run a single flow
maestro test .maestro/smoke.yaml

# Run all flows in .maestro/
yarn e2e
```

## Set the correct `appId`

Open `.maestro/smoke.yaml` and replace `com.testexpoowner.dev` with your actual dev bundle id. You can find it in `app.config.ts` under `ios.bundleIdentifier` / `android.package` for the `development` profile.

## Flows

| File                  | What it covers            |
| --------------------- | ------------------------- |
| `.maestro/smoke.yaml` | Sign-in → Home → Sign-out |

## Docs

- [Maestro documentation](https://maestro.mobile.dev/)
- [Flow syntax reference](https://maestro.mobile.dev/reference/configuration)
