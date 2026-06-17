import type { z } from 'zod';

interface ValidateEnvOptions<T extends z.ZodType> {
  schema: T;
  env: unknown;
}

export function validateEnv<T extends z.ZodType>({
  schema,
  env,
}: ValidateEnvOptions<T>): z.infer<T> {
  const result = schema.safeParse(env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(result.error.flatten().fieldErrors, null, 2));
    throw new Error('Invalid environment variables. Check logs above.');
  }

  return result.data;
}
