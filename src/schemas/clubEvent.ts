import { z } from 'zod';

// Same characters the backend allows in addresses (`clubs/.../locations`).
const TEXT_PATTERN = /^[\wа-яА-Я\sіІєЄґҐїЇ'!"№;%:?*()\-+=.,/]+$/;

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 * Create-event form (`POST clubs/:id/events/create` + location). Messages
 * are i18n keys.
 */
export const clubEventSchema = z.object({
  kind: z.enum(['party', 'trip', 'meeting']),
  description: z
    .string()
    .trim()
    .min(3, 'club.errors.descriptionLength')
    .max(500, 'club.errors.descriptionLength'),
  address: z
    .string()
    .trim()
    .min(10, 'club.errors.addressLength')
    .max(100, 'club.errors.addressLength')
    .regex(TEXT_PATTERN, 'club.errors.textInvalid'),
  date: z
    .date({ error: 'event.errors.dateRequired' })
    .refine((date) => date >= startOfToday(), 'event.errors.datePast'),
  time: z
    .string({ error: 'event.errors.timeRequired' })
    .regex(/^\d{2}:\d{2}$/, 'event.errors.timeRequired'),
  /** Associated match (fixture `_id`); 0 = none. */
  fixture: z.number(),
  visibility: z.enum(['open', 'friends']),
});

export type ClubEventFormInput = z.input<typeof clubEventSchema>;
export type ClubEventFormValues = z.output<typeof clubEventSchema>;
