import { fireEvent, render } from '@tests/test-utils';

import { AppHeader } from '@/ui/components';

const logo = { uri: 'https://example.com/logo.png' };

describe('AppHeader', () => {
  it('shows menu and profile as inactive when no handlers are given', () => {
    const { getByRole } = render(<AppHeader logo={logo} />);

    expect(getByRole('button', { name: 'nav.menu' })).toBeDisabled();
    expect(getByRole('button', { name: 'nav.profile' })).toBeDisabled();
  });

  it('calls the handlers when menu and profile are pressed', () => {
    const onMenuPress = jest.fn();
    const onProfilePress = jest.fn();
    const { getByRole } = render(
      <AppHeader
        logo={logo}
        onMenuPress={onMenuPress}
        onProfilePress={onProfilePress}
      />,
    );

    fireEvent.press(getByRole('button', { name: 'nav.menu' }));
    fireEvent.press(getByRole('button', { name: 'nav.profile' }));

    expect(onMenuPress).toHaveBeenCalledTimes(1);
    expect(onProfilePress).toHaveBeenCalledTimes(1);
  });

  it('supports a long press on the avatar', () => {
    const onProfileLongPress = jest.fn();
    const { getByRole } = render(
      <AppHeader logo={logo} onProfileLongPress={onProfileLongPress} />,
    );

    fireEvent(getByRole('button', { name: 'nav.profile' }), 'longPress');

    expect(onProfileLongPress).toHaveBeenCalledTimes(1);
  });
});
