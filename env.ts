import { validateEnv } from '@/utils/validateEnv';

import { type Env as EnvType, envSchema } from '@/schemas';

import packageJSON from './package.json';

// Config records per environment
const EXPO_PUBLIC_RUN_MODE = (process.env.EXPO_PUBLIC_RUN_MODE ??
  'dev') as EnvType['EXPO_PUBLIC_RUN_MODE'];

const BUNDLE_IDS = {
  dev: 'com.testexpoowner.dev',
  stg: 'com.testexpoowner.stg',
  prod: 'com.testexpoowner',
} as const;

const PACKAGES = {
  dev: 'com.testexpoowner.dev',
  stg: 'com.testexpoowner.stg',
  prod: 'com.testexpoowner',
} as const;

const SCHEMES = {
  dev: 'testexpo-owner',
  stg: 'testexpo-owner.stg',
  prod: 'testexpo-owner',
} as const;

const NAME = 'testexpo-owner';

// Check if strict validation is required (before prebuild)
const STRICT_ENV_VALIDATION = process.env.STRICT_ENV_VALIDATION === 'true';

// Build env object
const _env: EnvType = {
  EXPO_PUBLIC_RUN_MODE,

  EXPO_PUBLIC_NAME: NAME,
  EXPO_PUBLIC_SCHEME: SCHEMES[EXPO_PUBLIC_RUN_MODE],

  EXPO_PUBLIC_BUNDLE_ID: BUNDLE_IDS[EXPO_PUBLIC_RUN_MODE],
  EXPO_PUBLIC_PACKAGE: PACKAGES[EXPO_PUBLIC_RUN_MODE],

  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL ?? '',
  EXPO_PUBLIC_BUGSNAG_API_KEY: process.env.EXPO_PUBLIC_BUGSNAG_API_KEY ?? '',

  EXPO_PUBLIC_VERSION: packageJSON.version,
};

const Env = STRICT_ENV_VALIDATION
  ? validateEnv({
      schema: envSchema,
      env: _env,
    })
  : _env;

export default Env;
