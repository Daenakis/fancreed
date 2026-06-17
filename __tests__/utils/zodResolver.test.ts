import * as z from 'zod';

import { zod4Resolver } from '@/utils/zodResolver';

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

const resolver = zod4Resolver<FormValues>(schema);

const defaultOptions = {
  fields: {},
  shouldUseNativeValidation: false,
} as const;

describe('zod4Resolver', () => {
  it('returns parsed values when input is valid', async () => {
    const result = await resolver(
      { email: 'test@mail.com', password: '12345678' },
      undefined,
      defaultOptions,
    );

    expect(result.values).toEqual({
      email: 'test@mail.com',
      password: '12345678',
    });
    expect(result.errors).toEqual({});
  });

  it('returns field errors when input is invalid', async () => {
    const result = await resolver(
      { email: 'not-an-email', password: '123' },
      undefined,
      defaultOptions,
    );

    expect(result.values).toEqual({});
    expect(result.errors.email).toBeDefined();
    expect(result.errors.password).toBeDefined();
  });

  it('returns error for a single invalid field', async () => {
    const result = await resolver(
      { email: 'test@mail.com', password: '123' },
      undefined,
      defaultOptions,
    );

    expect(result.errors.email).toBeUndefined();
    expect(result.errors.password).toBeDefined();
    expect(result.errors.password?.message).toBeTruthy();
  });

  it('returns errors for all missing fields', async () => {
    const result = await resolver({} as FormValues, undefined, defaultOptions);

    expect(result.errors.email).toBeDefined();
    expect(result.errors.password).toBeDefined();
  });

  it('includes error type and message', async () => {
    const result = await resolver(
      { email: '', password: '' },
      undefined,
      defaultOptions,
    );

    const emailError = result.errors.email;
    expect(emailError).toBeDefined();
    expect(emailError?.type).toBeTruthy();
    expect(emailError?.message).toBeTruthy();
  });

  it('collects all criteria when criteriaMode is "all"', async () => {
    const strictSchema = z.object({
      code: z.string().min(3).max(5),
    });
    type StrictValues = z.infer<typeof strictSchema>;
    const strictResolver = zod4Resolver<StrictValues>(strictSchema);

    const result = await strictResolver(
      { code: '' } as StrictValues,
      undefined,
      { ...defaultOptions, criteriaMode: 'all' },
    );

    expect(result.errors.code).toBeDefined();
    expect(result.errors.code?.types).toBeDefined();
  });
});
