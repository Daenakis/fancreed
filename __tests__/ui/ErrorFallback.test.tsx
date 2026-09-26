import { fireEvent, render } from '@tests/test-utils';

import { ErrorFallback } from '@/ui/components';

describe('ErrorFallback', () => {
  const error = new Error('Something broke');

  it('renders the error message', () => {
    const { getByText } = render(<ErrorFallback error={error} />);

    expect(getByText('Something broke')).toBeTruthy();
  });

  it('renders the translated title and header', () => {
    const { getByRole } = render(<ErrorFallback error={error} />);

    expect(getByRole('header')).toBeTruthy();
  });

  it('renders the retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    const { getByRole } = render(
      <ErrorFallback error={error} onRetry={onRetry} />,
    );

    expect(getByRole('button')).toBeTruthy();
  });

  it('hides the retry button when onRetry is not provided', () => {
    const { queryByRole } = render(<ErrorFallback error={error} />);

    expect(queryByRole('button')).toBeNull();
  });

  it('calls onRetry when the retry button is pressed', () => {
    const onRetry = jest.fn();
    const { getByRole } = render(
      <ErrorFallback error={error} onRetry={onRetry} />,
    );

    fireEvent.press(getByRole('button'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not call onRetry on its own', () => {
    const onRetry = jest.fn();
    render(<ErrorFallback error={error} onRetry={onRetry} />);

    expect(onRetry).not.toHaveBeenCalled();
  });

  it('hides the raw error message in production and shows a generic one', () => {
    const globals = globalThis as unknown as { __DEV__: boolean };
    const originalDev = globals.__DEV__;
    globals.__DEV__ = false;

    try {
      const { getByText, queryByText } = render(
        <ErrorFallback error={error} />,
      );

      expect(queryByText('Something broke')).toBeNull();
      expect(getByText('errors.unexpected')).toBeTruthy();
    } finally {
      globals.__DEV__ = originalDev;
    }
  });

  it('displays different error messages correctly', () => {
    const customError = new Error('Custom failure reason');
    const { getByText } = render(<ErrorFallback error={customError} />);

    expect(getByText('Custom failure reason')).toBeTruthy();
  });
});
