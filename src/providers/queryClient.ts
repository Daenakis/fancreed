import { QueryClient } from '@tanstack/react-query';

import { QUERY_CONFIG } from '@/config';

/**
 * App-wide QueryClient. Lives in its own module (not QueryProvider.tsx)
 * so non-React code like the auth store can import it without pulling in
 * hooks and creating an import cycle.
 */
export const queryClient = new QueryClient(QUERY_CONFIG);
