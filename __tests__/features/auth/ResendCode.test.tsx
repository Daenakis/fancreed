import { act, fireEvent, render } from '@tests/test-utils';

import { ResendCode } from '@/features/auth/components';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('ResendCode', () => {
  it('shows the countdown and no link while the cooldown runs', () => {
    const { queryByRole, getByText } = render(
      <ResendCode onResend={jest.fn()} cooldownSeconds={3} />,
    );

    expect(getByText('auth.resendSeconds')).toBeTruthy();
    expect(queryByRole('link')).toBeNull();
  });

  it('shows the resend link when the countdown ends', () => {
    const { getByRole } = render(
      <ResendCode onResend={jest.fn()} cooldownSeconds={2} />,
    );

    act(() => jest.advanceTimersByTime(1000));
    act(() => jest.advanceTimersByTime(1000));

    expect(getByRole('link', { name: 'auth.resendCode' })).toBeTruthy();
  });

  it('calls onResend and restarts the countdown when the link is pressed', () => {
    const onResend = jest.fn();
    const { getByRole, queryByRole } = render(
      <ResendCode onResend={onResend} cooldownSeconds={1} />,
    );

    act(() => jest.advanceTimersByTime(1000));
    fireEvent.press(getByRole('link', { name: 'auth.resendCode' }));

    expect(onResend).toHaveBeenCalledTimes(1);
    expect(queryByRole('link')).toBeNull();
  });
});
