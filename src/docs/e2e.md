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

The smoke flow signs in to the **real backend**, so it needs an activated account. Pass it as env vars — never commit credentials:

```bash
maestro test -e EMAIL=you@example.com -e PASSWORD=secret .maestro/smoke.yaml
```

## Set the correct `appId`

`.maestro/smoke.yaml` targets the dev build (`com.fancreed.app.dev`). If the bundle ids change, update `appId` there to match `BUNDLE_IDS.dev` in `env.ts`.

## Flows

| File                  | What it covers                                 |
| --------------------- | ---------------------------------------------- |
| `.maestro/smoke.yaml` | Sign-in → Home (live news) → Profile → Log out |

## Docs

- [Maestro documentation](https://maestro.mobile.dev/)
- [Flow syntax reference](https://maestro.mobile.dev/reference/configuration)
