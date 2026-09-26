import { fireEvent, render } from '@tests/test-utils';

import { AuthButton } from '@/features/auth/components';

describe('AuthButton', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<AuthButton title="Go" onPress={onPress} />);

    fireEvent.press(getByRole('button', { name: 'Go' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('blocks presses when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <AuthButton title="Go" onPress={onPress} disabled />,
    );

    fireEvent.press(getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
    expect(getByRole('button')).toBeDisabled();
  });

  it('hides the title and blocks presses when loading', () => {
    const onPress = jest.fn();
    const { getByRole, queryByText } = render(
      <AuthButton title="Go" onPress={onPress} loading />,
    );

    fireEvent.press(getByRole('button'));

    expect(queryByText('Go')).toBeNull();
    expect(onPress).not.toHaveBeenCalled();
  });
});
