import { z } from 'zod';

/**
 * Auth field rules mirroring the backend apidoc exactly, so anything that
 * passes here is accepted by the server. Messages are i18n keys — translate
 * them where the error is shown.
 */
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 32;
export const ACTIVATION_CODE_LENGTH = 4;
export const RECOVERY_CODE_LENGTH = 8;

/** Backend `login`: ^[\w@.-]{3,100}$ (so e.g. "+" in an email is rejected). */
const LOGIN_PATTERN = /^[\w@.-]{3,100}$/;
/** Backend `name`: Latin/Cyrillic letters, digits, _, spaces, apostrophe. */
const NAME_PATTERN = /^[\wа-яА-Я\sіІєЄґҐїЇ']+$/;
/** Backend `password`: printable ASCII without spaces. */
const PASSWORD_PATTERN = /^[\w!"#$%&'()*+,\-./:;<=>?@[\\\]^`{|}~]+$/;

/**
 * Email used as the account login. Must also match the backend login rule,
 * otherwise the user could register but never sign in.
 */
export const emailField = z
  .string()
  .trim()
  .min(1, 'auth.errors.emailRequired')
  .refine(
    (v) => z.email().safeParse(v).success && LOGIN_PATTERN.test(v),
    'auth.errors.emailInvalid',
  );

/** Sign-in login — the backend's own rule, nothing stricter. */
export const loginField = z
  .string()
  .trim()
  .min(1, 'auth.errors.emailRequired')
  .regex(LOGIN_PATTERN, 'auth.errors.emailInvalid');

export const nameField = z
  .string()
  .trim()
  // iOS types a typographic apostrophe; the backend only accepts '.
  .transform((v) => v.replace(/[’ʼ`]/g, "'"))
  .pipe(
    z
      .string()
      .min(1, 'auth.errors.nameRequired')
      .min(NAME_MIN_LENGTH, 'auth.errors.nameTooShort')
      .max(NAME_MAX_LENGTH, 'auth.errors.nameTooLong')
      .regex(NAME_PATTERN, 'auth.errors.nameInvalid'),
  );

export const passwordField = z
  .string()
  .min(1, 'auth.errors.passwordRequired')
  .min(PASSWORD_MIN_LENGTH, 'auth.errors.passwordTooShort')
  .max(PASSWORD_MAX_LENGTH, 'auth.errors.passwordTooLong')
  .regex(PASSWORD_PATTERN, 'auth.errors.passwordInvalid');
