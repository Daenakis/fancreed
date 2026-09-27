import { z } from 'zod';

/**
 * Fan-club form, mirroring the backend (`POST clubs/create`). Messages are
 * i18n keys — translate them where the error is shown.
 */
const TEXT_PATTERN = /^[\wа-яА-Я\sіІєЄґҐїЇ'!"№;%:?*()\-+=.,]+$/;

const socialLink = (pattern: RegExp) =>
  z
    .string()
    .trim()
    .refine(
      (v) => v === '' || (v.length >= 10 && v.length <= 100 && pattern.test(v)),
      'club.errors.linkInvalid',
    );

export const clubSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'club.errors.nameLength')
    .max(50, 'club.errors.nameLength')
    .regex(TEXT_PATTERN, 'club.errors.textInvalid'),
  visibility: z.enum(['open', 'friends']),
  address: z
    .string()
    .trim()
    .min(10, 'club.errors.addressLength')
    .max(100, 'club.errors.addressLength')
    .regex(TEXT_PATTERN, 'club.errors.textInvalid'),
  description: z
    .string()
    .trim()
    .min(3, 'club.errors.descriptionLength')
    .max(500, 'club.errors.descriptionLength'),
  facebook: socialLink(/^https:\/\/(www\.)?facebook\.com\/.*$/),
  instagram: socialLink(/^https:\/\/(www\.)?instagram\.com\/.*$/),
  telegram: socialLink(/^https:\/\/(www\.)?t\.me\/.*$/),
});

export type ClubFormValues = z.infer<typeof clubSchema>;
