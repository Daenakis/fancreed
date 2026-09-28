import { validateEnv } from '@/utils/validateEnv';

import { type Env as EnvType, envSchema } from '@/schemas';

import packageJSON from './package.json';

// Config records per environment
const EXPO_PUBLIC_RUN_MODE = (process.env.EXPO_PUBLIC_RUN_MODE ??
  'dev') as EnvType['EXPO_PUBLIC_RUN_MODE'];

const BUNDLE_IDS = {
  dev: 'com.fancreed.app.dev',
  stg: 'com.fancreed.app.stg',
  prod: 'com.fancreed.app',
} as const;

const PACKAGES = {
  dev: 'com.fancreed.app.dev',
  stg: 'com.fancreed.app.stg',
  prod: 'com.fancreed.app',
} as const;

// Unique per environment so deep links open the right build when several
// are installed on one device.
const SCHEMES = {
  dev: 'fancreed-dev',
  stg: 'fancreed-stg',
  prod: 'fancreed',
} as const;

// Same backend for every build until staging/production servers exist.
// EXPO_PUBLIC_API_URL (e.g. in .env) overrides it for local testing.
const API_URLS = {
  dev: 'https://app.fancreed.com/api/',
  stg: 'https://app.fancreed.com/api/',
  prod: 'https://app.fancreed.com/api/',
} as const;

const NAME = 'Fancreed';

// Check if strict validation is required (before prebuild)
const STRICT_ENV_VALIDATION = process.env.STRICT_ENV_VALIDATION === 'true';

// Build env object
const _env: EnvType = {
  EXPO_PUBLIC_RUN_MODE,

  EXPO_PUBLIC_NAME: NAME,
  EXPO_PUBLIC_SCHEME: SCHEMES[EXPO_PUBLIC_RUN_MODE],

  EXPO_PUBLIC_BUNDLE_ID: BUNDLE_IDS[EXPO_PUBLIC_RUN_MODE],
  EXPO_PUBLIC_PACKAGE: PACKAGES[EXPO_PUBLIC_RUN_MODE],

  EXPO_PUBLIC_API_URL:
    process.env.EXPO_PUBLIC_API_URL || API_URLS[EXPO_PUBLIC_RUN_MODE],
  EXPO_PUBLIC_BUGSNAG_API_KEY: process.env.EXPO_PUBLIC_BUGSNAG_API_KEY ?? '',

  EXPO_PUBLIC_VERSION: packageJSON.version,

  // Test account for the sign-in form — dev builds only (see .env.example).
  EXPO_PUBLIC_DEV_LOGIN:
    EXPO_PUBLIC_RUN_MODE === 'dev'
      ? (process.env.EXPO_PUBLIC_DEV_LOGIN ?? '')
      : '',
  EXPO_PUBLIC_DEV_PASSWORD:
    EXPO_PUBLIC_RUN_MODE === 'dev'
      ? (process.env.EXPO_PUBLIC_DEV_PASSWORD ?? '')
      : '',
};

// Strict (EAS builds): invalid env fails the build.
// Otherwise (local dev): invalid env is logged as a warning.
const Env = validateEnv({
  schema: envSchema,
  env: _env,
  onInvalid: STRICT_ENV_VALIDATION ? 'throw' : 'warn',
});

// Named too: EAS CLI's config reader wraps a default import from
// app.config.ts as `{ default }`, so app.config.ts imports `{ Env }`.
export { Env };
export default Env;
