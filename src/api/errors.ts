import { isAxiosError } from 'axios';

import type { ApiErrorBody } from '@/types/api';

/** Known backend failures, independent of the backend's wording. */
export type ApiErrorCode =
  | 'WRONG_PASSWORD'
  | 'ACCOUNT_NOT_FOUND'
  | 'USER_EXISTS'
  | 'WRONG_CODE'
  | 'CODE_EXPIRED'
  | 'ALREADY_ACTIVATED'
  | 'NOT_ACTIVATED'
  | 'BAD_REQUEST'
  | 'NETWORK'
  | 'UNKNOWN';

// Backend `message` texts (see the old app's errorHandler and live responses).
const MESSAGE_CODES: Record<string, ApiErrorCode> = {
  'Wrong password': 'WRONG_PASSWORD',
  'Document not found': 'ACCOUNT_NOT_FOUND',
  'User already exists': 'USER_EXISTS',
  'Wrong code': 'WRONG_CODE',
  'Code expired': 'CODE_EXPIRED',
  'Account already confirmed': 'ALREADY_ACTIVATED',
  'Your account needs to be verified': 'NOT_ACTIVATED',
  'Bad request': 'BAD_REQUEST',
};

/** i18n key shown to the user for each code. */
export const API_ERROR_MESSAGE_KEYS = {
  WRONG_PASSWORD: 'errors.api.wrongPassword',
  ACCOUNT_NOT_FOUND: 'errors.api.accountNotFound',
  USER_EXISTS: 'errors.api.userExists',
  WRONG_CODE: 'errors.api.wrongCode',
  CODE_EXPIRED: 'errors.api.codeExpired',
  ALREADY_ACTIVATED: 'errors.api.alreadyActivated',
  NOT_ACTIVATED: 'errors.api.notActivated',
  BAD_REQUEST: 'errors.unknown',
  NETWORK: 'errors.network',
  UNKNOWN: 'errors.unknown',
} as const satisfies Record<ApiErrorCode, string>;

export function getApiErrorCode(error: unknown): ApiErrorCode {
  if (!isAxiosError<ApiErrorBody>(error)) return 'UNKNOWN';
  if (!error.response) return 'NETWORK';
  const message = error.response.data?.message;
  return (message && MESSAGE_CODES[message]) || 'UNKNOWN';
}

/** i18n key for any thrown value — for errors shown as plain text. */
export const getApiErrorMessageKey = (error: unknown) =>
  API_ERROR_MESSAGE_KEYS[getApiErrorCode(error)];

/**
 * Maps an API error onto a react-hook-form error: the field listed for its
 * code, or `root.server` (shown under the submit button) otherwise.
 *
 * @example
 * const { name, message } = toFormError(error, { WRONG_PASSWORD: 'password' });
 * setError(name, { message });
 */
export function toFormError<Field extends string>(
  error: unknown,
  fields: Partial<Record<ApiErrorCode, Field>> = {},
): { name: Field | 'root.server'; message: string } {
  const code = getApiErrorCode(error);
  return {
    name: fields[code] ?? 'root.server',
    message: API_ERROR_MESSAGE_KEYS[code],
  };
}
