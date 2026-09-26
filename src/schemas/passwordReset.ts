import { z } from 'zod';

/** Messages are i18n keys — translate them where the error is shown. */
export const forgotPasswordSchema = z.object({
  login: z.string().trim().min(1, 'auth.errors.loginRequired'),
});

/** Digits in the password-reset verification code. */
export const RESET_CODE_LENGTH = 6;

export const newPasswordSchema = z
  .object({
    password: z.string().min(1, 'auth.errors.passwordRequired'),
    confirmPassword: z.string().min(1, 'auth.errors.passwordRequired'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'auth.errors.passwordsMismatch',
    path: ['confirmPassword'],
  });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;
