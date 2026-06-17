import type { ComponentType } from 'react';

export default {
  start: jest.fn(),
  withInstrumentedAppStarts: <P extends object>(Component: ComponentType<P>) =>
    Component,
};
