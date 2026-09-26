import { z } from 'zod';

import { loginField, passwordField } from './authFields';

export const signInSchema = z.object({
  login: loginField,
  password: passwordField,
});

export type SignInFormValues = z.infer<typeof signInSchema>;
