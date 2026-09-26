import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react-native';
import { AxiosError, type AxiosResponse } from 'axios';
import type { ReactElement, ReactNode } from 'react';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

function AllProviders({ children }: { children: ReactNode }) {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react-native';
export { renderWithProviders as render };

/** Resolved axios response, for `jest.spyOn(authApi, …).mockResolvedValue`. */
export const apiOk = <T,>(data: T) =>
  ({ data, status: 200 }) as AxiosResponse<T>;

/** Rejected axios error carrying a backend `{ message }` body. */
export const apiFail = (status: number, message: string) =>
  new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, null, {
    status,
    data: { message, description: '' },
  } as AxiosResponse);
