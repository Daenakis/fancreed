import type { ReactNode } from 'react';

export default {
  start: jest.fn(),
  notify: jest.fn(),
  leaveBreadcrumb: jest.fn(),
  getPlugin: jest.fn(() => ({
    createErrorBoundary: jest.fn(() => {
      const ErrorBoundary = ({ children }: { children: ReactNode }) => children;
      return ErrorBoundary;
    }),
  })),
};
