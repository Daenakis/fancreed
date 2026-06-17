import z from 'zod';

export const envSchema = z.object({
  EXPO_PUBLIC_RUN_MODE: z.enum(['dev', 'stg', 'prod']),

  EXPO_PUBLIC_API_URL: z.url(),
  EXPO_PUBLIC_BUGSNAG_API_KEY: z.string().default(''),

  EXPO_PUBLIC_NAME: z.string(),
  EXPO_PUBLIC_SCHEME: z.string(),
  EXPO_PUBLIC_BUNDLE_ID: z.string(),
  EXPO_PUBLIC_PACKAGE: z.string(),

  EXPO_PUBLIC_VERSION: z.string(),
});

export type Env = z.infer<typeof envSchema>;
