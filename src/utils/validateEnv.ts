import { z } from 'zod';

interface ValidateEnvOptions<T extends z.ZodType> {
  schema: T;
  env: unknown;
  /**
   * 'throw' (default) — fail fast; use for builds (STRICT_ENV_VALIDATION).
   * 'warn' — log the problems and return env unvalidated; use for local dev
   * so a missing variable is visible without blocking Metro.
   */
  onInvalid?: 'throw' | 'warn';
}

export function validateEnv<T extends z.ZodType>({
  schema,
  env,
  onInvalid = 'throw',
}: ValidateEnvOptions<T>): z.infer<T> {
  const result = schema.safeParse(env);

  if (result.success) return result.data;

  const fieldErrors = JSON.stringify(
    z.flattenError(result.error).fieldErrors,
    null,
    2,
  );

  if (onInvalid === 'warn') {
    console.warn(`⚠️ Invalid environment variables:\n${fieldErrors}`);
    return env as z.infer<T>;
  }

  console.error(`❌ Invalid environment variables:\n${fieldErrors}`);
  throw new Error('Invalid environment variables. Check logs above.');
}
