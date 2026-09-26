import { z } from 'zod';

/** Messages are i18n keys — translate them where the error is shown. */
export const signUpSchema = z.object({
  name: z.string().trim().min(1, 'auth.errors.nameRequired'),
  login: z.string().trim().min(1, 'auth.errors.loginRequired'),
  password: z.string().min(1, 'auth.errors.passwordRequired'),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
