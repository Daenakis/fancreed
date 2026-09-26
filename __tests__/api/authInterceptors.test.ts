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
  const refreshTokens = jest.fn();
  setupAuthInterceptors(instance, refreshTokens);
  return { instance, adapter, refreshTokens };
}

const authHeader = (config: InternalAxiosRequestConfig) =>
  config.headers.Authorization;

/** Server that accepts only the given access token. */
const acceptsOnly = (token: string) => (config: InternalAxiosRequestConfig) =>
  authHeader(config) === `Bearer ${token}` ? 200 : 401;

function refreshError(status?: number) {
  const response = status
    ? {
        data: {},
        status,
        statusText: '',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      }
    : undefined;
  return new AxiosError('Refresh failed', 'ERR', undefined, null, response);
}

beforeEach(() => {
  useAuthStore.setState({
    accessToken: 'old-access',
    refreshToken: 'old-refresh',
  });
});

describe('setupAuthInterceptors', () => {
  it('attaches the bearer token when signed in', async () => {
    const { instance, adapter } = createClient(() => 200);

    await instance.get('/me');

    expect(authHeader(adapter.mock.calls[0][0])).toBe('Bearer old-access');
  });

  it('sends no auth header when signed out', async () => {
    useAuthStore.setState({ accessToken: null, refreshToken: null });
    const { instance, adapter } = createClient(() => 200);

    await instance.get('/public');

    expect(authHeader(adapter.mock.calls[0][0])).toBeUndefined();
  });

  it('refreshes and retries with the new token when a request gets 401', async () => {
    const { instance, refreshTokens } = createClient(acceptsOnly('new-access'));
    refreshTokens.mockResolvedValue({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });

    const response = await instance.get('/me');

    expect(response.status).toBe(200);
    expect(refreshTokens).toHaveBeenCalledWith('old-refresh');
    expect(useAuthStore.getState().accessToken).toBe('new-access');
    expect(useAuthStore.getState().refreshToken).toBe('new-refresh');
  });

  it('refreshes only once when several requests get 401 at the same time', async () => {
    const { instance, refreshTokens } = createClient(acceptsOnly('new-access'));
    refreshTokens.mockResolvedValue({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });

    const responses = await Promise.all([
      instance.get('/a'),
      instance.get('/b'),
      instance.get('/c'),
    ]);

    expect(responses.map((r) => r.status)).toEqual([200, 200, 200]);
    expect(refreshTokens).toHaveBeenCalledTimes(1);
  });

  it('signs out when the backend rejects the refresh token', async () => {
    const { instance, refreshTokens } = createClient(() => 401);
    refreshTokens.mockRejectedValue(refreshError(401));

    await expect(instance.get('/me')).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
  });

  it('keeps the session when the refresh call fails with a network error', async () => {
    const { instance, refreshTokens } = createClient(() => 401);
    refreshTokens.mockRejectedValue(refreshError());

    await expect(instance.get('/me')).rejects.toThrow('Refresh failed');
    expect(useAuthStore.getState().accessToken).toBe('old-access');
  });

  it('does not refresh when a signed-out request gets 401', async () => {
    useAuthStore.setState({ accessToken: null, refreshToken: null });
    const { instance, refreshTokens } = createClient(() => 401);

    await expect(instance.post('/auth/login')).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(refreshTokens).not.toHaveBeenCalled();
  });

  it('does not loop when the retried request gets 401 again', async () => {
    const { instance, adapter, refreshTokens } = createClient(() => 401);
    refreshTokens.mockResolvedValue({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });

    await expect(instance.get('/me')).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(refreshTokens).toHaveBeenCalledTimes(1);
    expect(adapter).toHaveBeenCalledTimes(2);
  });
});
