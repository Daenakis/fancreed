import { z } from 'zod';

import { nameField } from './authFields';

export const FEEDBACK_MESSAGE_MAX_LENGTH = 1000;

/** Digits with an optional leading "+", 10–14 digits (as the profile phone). */
const PHONE_PATTERN = /^\+?\d{10,14}$/;

/**
 * Feedback form. Messages are i18n keys. The phone is sent without spaces,
 * dashes or brackets.
 */
export const feedbackSchema = z.object({
  name: nameField,
  phone: z
    .string()
    .transform((v) => v.replace(/[\s\-()]/g, ''))
    .pipe(
      z
        .string()
        .min(1, 'feedback.errors.phoneRequired')
        .regex(PHONE_PATTERN, 'feedback.errors.phoneInvalid'),
    ),
  message: z
    .string()
    .trim()
    .min(1, 'feedback.errors.messageRequired')
    .max(FEEDBACK_MESSAGE_MAX_LENGTH, 'feedback.errors.messageTooLong'),
});

export type FeedbackFormInput = z.input<typeof feedbackSchema>;
export type FeedbackFormValues = z.output<typeof feedbackSchema>;
