import { fireEvent, render } from '@tests/test-utils';
import { router } from 'expo-router';
import { Alert, Linking } from 'react-native';

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

  it('closes the menu and opens the standings screen at once', () => {
    const { getByRole } = render(<SideMenu visible onClose={onClose} />);

    fireEvent.press(getByRole('button', { name: 'menu.tables' }));

    expect(onClose).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith('/standings');
  });

  it('says settings are coming soon', () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByRole } = render(<SideMenu visible onClose={onClose} />);

    fireEvent.press(getByRole('button', { name: 'menu.settings' }));

    expect(alert).toHaveBeenCalledWith('menu.comingSoon');
  });

  it('closes from the back arrow', () => {
    const { getByRole } = render(<SideMenu visible onClose={onClose} />);

    fireEvent.press(getByRole('button', { name: 'common.back' }));

    expect(onClose).toHaveBeenCalled();
  });
});
