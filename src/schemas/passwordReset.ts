import { z } from 'zod';

import { emailField, passwordField } from './authFields';

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const newPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, 'auth.errors.passwordRequired'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'auth.errors.passwordsMismatch',
    path: ['confirmPassword'],
  });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;
