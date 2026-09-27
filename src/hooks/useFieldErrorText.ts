import type { ParseKeys } from 'i18next';
import { useTranslation } from 'react-i18next';

import {
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/schemas';

// Values interpolated into length messages (`{{min}}`, `{{max}}`).
const LIMITS: Partial<Record<string, { min?: number; max?: number }>> = {
  'auth.errors.nameTooShort': { min: NAME_MIN_LENGTH },
  'auth.errors.nameTooLong': { max: NAME_MAX_LENGTH },
  'auth.errors.passwordTooShort': { min: PASSWORD_MIN_LENGTH },
  'auth.errors.passwordTooLong': { max: PASSWORD_MAX_LENGTH },
};

/**
 * Turns a react-hook-form error (field or `root.server`, message = i18n key)
 * into display text.
 */
export function useFieldErrorText() {
  const { t } = useTranslation();

  return (error?: { message?: string }) => {
    const key = error?.message;
    if (!key) return undefined;
    return t(key as ParseKeys, LIMITS[key] ?? {});
  };
}
