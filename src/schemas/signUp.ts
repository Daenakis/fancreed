import { z } from 'zod';

import { emailField, nameField, passwordField } from './authFields';

export const signUpSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
});

export type SignUpFormInput = z.input<typeof signUpSchema>;
export type SignUpFormValues = z.output<typeof signUpSchema>;
