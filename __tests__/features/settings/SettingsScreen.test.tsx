import { fireEvent, render, waitFor } from '@tests/test-utils';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

import { SettingsScreen } from '@/features/settings';

const mockChangeLanguage = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'uk', changeLanguage: mockChangeLanguage },
  }),
}));

beforeEach(() => {
  jest
    .requireMock<{ __clearStore: () => void }>('react-native-mmkv')
    .__clearStore();
});

describe('SettingsScreen', () => {
  it('shows verification as not available yet', () => {
    const { getByRole } = render(<SettingsScreen />);

    expect(
      getByRole('button', { name: 'settings.verification' }),
    ).toBeDisabled();
  });

  it('turns push notifications on and remembers it', () => {
    const { getByRole, unmount } = render(<SettingsScreen />);

    expect(getByRole('switch', { name: 'settings.push' })).not.toBeChecked();
    fireEvent.press(getByRole('switch', { name: 'settings.push' }));
    expect(getByRole('switch', { name: 'settings.push' })).toBeChecked();

    // Stored: a fresh screen shows it on.
    unmount();
    const reopened = render(<SettingsScreen />);
    expect(
      reopened.getByRole('switch', { name: 'settings.push' }),
    ).toBeChecked();
  });

  it('turns geolocation on once the permission is granted', async () => {
    const { getByRole } = render(<SettingsScreen />);

    fireEvent.press(getByRole('switch', { name: 'settings.location' }));

    await waitFor(() =>
      expect(getByRole('switch', { name: 'settings.location' })).toBeChecked(),
    );
    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
  });

  it('keeps geolocation off and offers the phone settings when denied for good', async () => {
    jest
      .mocked(Location.requestForegroundPermissionsAsync)
      .mockResolvedValueOnce({
        granted: false,
        canAskAgain: false,
      } as Location.LocationPermissionResponse);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByRole } = render(<SettingsScreen />);

    fireEvent.press(getByRole('switch', { name: 'settings.location' }));

    await waitFor(() =>
      expect(alert).toHaveBeenCalledWith(
        'settings.locationDenied',
        undefined,
        expect.arrayContaining([
          expect.objectContaining({ text: 'settings.openSettings' }),
        ]),
      ),
    );
    expect(
      getByRole('switch', { name: 'settings.location' }),
    ).not.toBeChecked();
  });

  it('shows the current language and picks another in the sheet', () => {
    const { getByRole, getByText } = render(<SettingsScreen />);

    fireEvent.press(
      getByRole('button', { name: 'settings.language, Українська' }),
    );
    fireEvent.press(getByText('English'));

    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });
});
