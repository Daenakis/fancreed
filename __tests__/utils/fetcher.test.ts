import type { AxiosResponse } from 'axios';

import { fetcher } from '@/api/fetcher';

describe('fetcher', () => {
  it('unwraps AxiosResponse to data', async () => {
    const response = {
      data: { id: '1', name: 'Test' },
      status: 200,
    } as AxiosResponse;

    const result = await fetcher(Promise.resolve(response));

    expect(result).toEqual({ id: '1', name: 'Test' });
  });

  it('preserves the generic type of the response data', async () => {
    type User = { id: string; email: string };

    const response = {
      data: { id: '1', email: 'test@mail.com' },
      status: 200,
    } as AxiosResponse<User>;

    const result = await fetcher(Promise.resolve(response));

    expect(result.id).toBe('1');
    expect(result.email).toBe('test@mail.com');
  });

  it('rejects when the request fails', async () => {
    const error = new Error('Network Error');

    await expect(fetcher(Promise.reject(error))).rejects.toThrow(
      'Network Error',
    );
  });

  it('handles null data in the response', async () => {
    const response = { data: null, status: 204 } as AxiosResponse;

    const result = await fetcher(Promise.resolve(response));

    expect(result).toBeNull();
  });

  it('handles empty array data', async () => {
    const response = { data: [], status: 200 } as AxiosResponse;

    const result = await fetcher(Promise.resolve(response));

    expect(result).toEqual([]);
  });
});
