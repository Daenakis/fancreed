import { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { shouldRetryQuery } from '@/utils/shouldRetryQuery';

function httpError(status: number) {
  const config = {} as InternalAxiosRequestConfig;
  return new AxiosError('Request failed', 'ERR', config, null, {
    data: {},
    status,
    statusText: '',
    headers: {},
    config,
  });
}

describe('shouldRetryQuery', () => {
  it.each([400, 401, 403, 404, 422])(
    'does not retry when the server responds %i',
    (status) => {
      expect(shouldRetryQuery(0, httpError(status))).toBe(false);
    },
  );

  it.each([500, 502, 503])('retries when the server responds %i', (status) => {
    expect(shouldRetryQuery(0, httpError(status))).toBe(true);
  });

  it('retries network errors without a response', () => {
    expect(shouldRetryQuery(0, new AxiosError('Network Error'))).toBe(true);
  });

  it('retries non-axios errors', () => {
    expect(shouldRetryQuery(0, new Error('boom'))).toBe(true);
  });

  it('stops after two retries', () => {
    expect(shouldRetryQuery(1, httpError(500))).toBe(true);
    expect(shouldRetryQuery(2, httpError(500))).toBe(false);
  });
});
