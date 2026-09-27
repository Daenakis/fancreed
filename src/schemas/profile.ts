import { z } from 'zod';

import { nameField } from './authFields';

/** Edit profile form. Name, surname, birthday and sex unlock the fan card. */
export const profileSchema = z.object({
  name: nameField,
  surname: nameField,
  // Optional, but when filled it follows the same rules as the name.
  patronymic: z.union([z.literal(''), nameField]),
  birthDay: z
    .date({ error: 'profile.errors.birthDayRequired' })
    .refine((date) => date <= new Date(), 'profile.errors.birthDayFuture'),
  sex: z.enum(['m', 'f'], { error: 'profile.errors.sexRequired' }),
});

export type ProfileFormInput = z.input<typeof profileSchema>;
export type ProfileFormValues = z.output<typeof profileSchema>;
