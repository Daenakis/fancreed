import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { useAppFocusManager, useOnlineManager } from '@/hooks';

import { queryClient } from './queryClient';

export function QueryProvider({ children }: { children: ReactNode }) {
  useOnlineManager();
  useAppFocusManager();
  useReactQueryDevTools(queryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
