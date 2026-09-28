import { fireEvent, render } from '@tests/test-utils';
import { router } from 'expo-router';
import { Linking } from 'react-native';

import { CONFIG } from '@/config';

import { SideMenu } from '@/features/menu';

const onClose = jest.fn();

describe('SideMenu', () => {
  it('opens the team page on the club site', () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    const { getByRole } = render(<SideMenu visible onClose={onClose} />);

    fireEvent.press(getByRole('button', { name: 'menu.team' }));

    expect(openURL).toHaveBeenCalledWith(CONFIG.LINKS.TEAM);
  });

  it('closes the menu and opens the tournament screen at once', () => {
    const { getByRole } = render(<SideMenu visible onClose={onClose} />);

    fireEvent.press(getByRole('button', { name: 'menu.tables' }));

    expect(onClose).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/tournament');
  });

  it.each([
    ['menu.settings', '/settings'],
    ['menu.feedback', '/feedback'],
  ])('opens %s at %s', (name, path) => {
    const { getByRole } = render(<SideMenu visible onClose={onClose} />);

    fireEvent.press(getByRole('button', { name }));

    expect(onClose).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith(path);
  });

  it('closes from the cross in place of the menu button', () => {
    const { getByRole } = render(<SideMenu visible onClose={onClose} />);

    const close = getByRole('button', { name: 'common.close' });
    expect(close).toBeExpanded();

    fireEvent.press(close);

    expect(onClose).toHaveBeenCalled();
  });
});
