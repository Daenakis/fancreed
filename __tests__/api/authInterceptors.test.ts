import {
  AxiosError,
  type AxiosResponse,
  create,
  type InternalAxiosRequestConfig,
} from 'axios';

import { setupAuthInterceptors } from '@/api/authInterceptors';

import { useAuthStore } from '@/store';

type Handler = (config: InternalAxiosRequestConfig) => number;

function respond(
  config: InternalAxiosRequestConfig,
  status: number,
): Promise<AxiosResponse> {
  const response = {
    data: { ok: status < 400 },
    status,
    statusText: '',
    headers: {},
    config,
  };

  if (status >= 400) {
    return Promise.reject(
      new AxiosError(
        'Request failed',
        'ERR_BAD_REQUEST',
        config,
        null,
        response,
      ),
    );
  }
  return Promise.resolve(response);
}

/** Axios instance whose server replies with the status returned by `handler`. */
function createClient(handler: Handler) {
  const adapter = jest.fn((config: InternalAxiosRequestConfig) =>
    respond(config, handler(config)),
  );
  const instance = create({ adapter });
  setupAuthInterceptors(instance);
  return { instance, adapter };
}

beforeEach(() => {
  useAuthStore.setState({ accessToken: 'current-token' });
});

describe('setupAuthInterceptors', () => {
  it('sends the current token as a Bearer header', async () => {
    const { instance, adapter } = createClient(() => 200);

    await instance.get('/me');

    expect(adapter.mock.calls[0][0].headers.Authorization).toBe(
      'Bearer current-token',
    );
  });

  it('sends no Authorization header when signed out', async () => {
    useAuthStore.setState({ accessToken: null });
    const { instance, adapter } = createClient(() => 200);

    await instance.get('/public');

    expect(adapter.mock.calls[0][0].headers.Authorization).toBeUndefined();
  });

  it('signs out when the current token is rejected with 401', async () => {
    const { instance } = createClient(() => 401);

    await expect(instance.get('/me')).rejects.toBeInstanceOf(AxiosError);

    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it('keeps the session when a 401 comes from an older token', async () => {
    const { instance } = createClient((config) => {
      // The user signs in again while this request is in flight.
      useAuthStore.setState({ accessToken: 'newer-token' });
      return config.headers.Authorization === 'Bearer current-token'
        ? 401
        : 200;
    });

    await expect(instance.get('/me')).rejects.toBeInstanceOf(AxiosError);

    expect(useAuthStore.getState().accessToken).toBe('newer-token');
  });

  it('keeps the session and rethrows on other errors', async () => {
    const { instance } = createClient(() => 403);

    await expect(instance.get('/me')).rejects.toBeInstanceOf(AxiosError);

    expect(useAuthStore.getState().accessToken).toBe('current-token');
  });
});
