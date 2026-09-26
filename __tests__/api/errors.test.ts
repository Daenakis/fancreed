import { AxiosError, type AxiosResponse } from 'axios';

import { getApiErrorCode, getApiErrorMessageKey, toFormError } from '@/api';

const apiError = (status: number, message?: string) =>
  new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, null, {
    status,
    data: message ? { message, description: '' } : undefined,
  } as AxiosResponse);

describe('getApiErrorCode', () => {
  it.each([
    ['Wrong password', 'WRONG_PASSWORD'],
    ['Document not found', 'ACCOUNT_NOT_FOUND'],
    ['User already exists', 'USER_EXISTS'],
    ['Wrong code', 'WRONG_CODE'],
    ['Code expired', 'CODE_EXPIRED'],
    ['Account already confirmed', 'ALREADY_ACTIVATED'],
    ['Account not verified', 'NOT_ACTIVATED'],
    ['Bad request', 'BAD_REQUEST'],
  ])('maps the backend message "%s" to %s', (message, code) => {
    expect(getApiErrorCode(apiError(400, message))).toBe(code);
  });

  it('returns UNKNOWN when the message is not recognised', () => {
    expect(getApiErrorCode(apiError(500, 'Server error'))).toBe('UNKNOWN');
  });

  it('returns NETWORK when there is no response', () => {
    expect(getApiErrorCode(new AxiosError('Network Error'))).toBe('NETWORK');
  });

  it('returns UNKNOWN for non-axios errors', () => {
    expect(getApiErrorCode(new Error('boom'))).toBe('UNKNOWN');
  });
});

describe('getApiErrorMessageKey', () => {
  it('returns the i18n key for the error', () => {
    expect(getApiErrorMessageKey(apiError(403, 'Wrong password'))).toBe(
      'errors.api.wrongPassword',
    );
  });
});

describe('toFormError', () => {
  it('targets the mapped field when the code is listed', () => {
    expect(
      toFormError(apiError(403, 'Wrong password'), {
        WRONG_PASSWORD: 'password',
      }),
    ).toEqual({ name: 'password', message: 'errors.api.wrongPassword' });
  });

  it('falls back to root.server when the code is not listed', () => {
    expect(toFormError(apiError(500, 'Server error'))).toEqual({
      name: 'root.server',
      message: 'errors.unknown',
    });
  });
});
