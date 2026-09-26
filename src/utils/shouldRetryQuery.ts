import { isAxiosError } from 'axios';

const MAX_RETRIES = 2;

/**
 * React Query `retry` policy: retry network errors and 5xx up to
 * MAX_RETRIES times, but never 4xx — a bad request, 401/403 or 404
 * won't succeed on retry and only delays showing the error.
 */
export function shouldRetryQuery(failureCount: number, error: unknown) {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status !== undefined && status >= 400 && status < 500) return false;
  }

  return failureCount < MAX_RETRIES;
}
