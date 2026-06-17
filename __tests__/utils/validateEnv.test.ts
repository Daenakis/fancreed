import * as z from 'zod';

import { validateEnv } from '@/utils/validateEnv';

const schema = z.object({
  NAME: z.string(),
  PORT: z.coerce.number().int().positive(),
});

describe('validateEnv', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns parsed values when env is valid', () => {
    const result = validateEnv({ schema, env: { NAME: 'app', PORT: '3000' } });

    expect(result).toEqual({ NAME: 'app', PORT: 3000 });
  });

  it('throws when a required field is missing', () => {
    expect(() => validateEnv({ schema, env: { NAME: 'app' } })).toThrow(
      'Invalid environment variables',
    );
  });

  it('throws when a field has an incompatible value', () => {
    expect(() =>
      validateEnv({ schema, env: { NAME: 'app', PORT: 'not-a-number' } }),
    ).toThrow('Invalid environment variables');
  });

  it('throws when env is an empty object', () => {
    expect(() => validateEnv({ schema, env: {} })).toThrow(
      'Invalid environment variables',
    );
  });
});
