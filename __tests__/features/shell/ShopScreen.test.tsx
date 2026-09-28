import { act, fireEvent, render } from '@tests/test-utils';
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';

import { CONFIG } from '@/config';

import { ShopScreen } from '@/features/shell';

type ShouldStart = (request: { url: string }) => boolean;

describe('ShopScreen', () => {
  it('opens the club shop in the web view', () => {
    const { UNSAFE_getByType } = render(<ShopScreen />);

    expect(UNSAFE_getByType(WebView).props.source).toEqual({
      uri: CONFIG.LINKS.SHOP,
    });
  });

  it('hands phone and email links to the phone and keeps web links inside', () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    const { UNSAFE_getByType } = render(<ShopScreen />);
    const shouldStart: ShouldStart =
      UNSAFE_getByType(WebView).props.onShouldStartLoadWithRequest;

    expect(shouldStart({ url: 'tel:+33123456789' })).toBe(false);
    expect(openURL).toHaveBeenCalledWith('tel:+33123456789');
    expect(
      shouldStart({ url: 'https://www.boutiquedesverts.fr/products/1' }),
    ).toBe(true);
  });

  it('shows an error with a retry that loads the shop again', () => {
    const { UNSAFE_getByType, UNSAFE_queryByType, getByRole, getByText } =
      render(<ShopScreen />);

    act(() => UNSAFE_getByType(WebView).props.onError());

    expect(getByText('shop.errorTitle')).toBeTruthy();
    expect(UNSAFE_queryByType(WebView)).toBeNull();

    fireEvent.press(getByRole('button', { name: 'shop.retry' }));

    expect(UNSAFE_getByType(WebView)).toBeTruthy();
  });
});
