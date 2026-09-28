import { fireEvent, render } from '@tests/test-utils';
import { Image } from 'react-native';

import { RemoteImage } from '@/ui/components';

const load = (width = 400, height = 600) => ({
  nativeEvent: { source: { width, height, uri: '' } },
});

describe('RemoteImage', () => {
  it('shows the skeleton (busy) while a URL image is loading', () => {
    const { getByRole } = render(
      <RemoteImage
        source={{ uri: 'https://example.com/a.jpg' }}
        accessibilityLabel="Photo"
      />,
    );

    expect(getByRole('image', { name: 'Photo' })).toBeBusy();
  });

  it('hides the skeleton once the image has loaded', () => {
    const { getByRole, UNSAFE_getByType } = render(
      <RemoteImage
        source={{ uri: 'https://example.com/a.jpg' }}
        accessibilityLabel="Photo"
      />,
    );

    fireEvent(UNSAFE_getByType(Image), 'load', load());

    expect(getByRole('image', { name: 'Photo' })).not.toBeBusy();
  });

  it('stops loading when the image fails', () => {
    const onError = jest.fn();
    const { getByRole, UNSAFE_getByType } = render(
      <RemoteImage
        source={{ uri: 'https://example.com/a.jpg' }}
        accessibilityLabel="Photo"
        onError={onError}
      />,
    );

    fireEvent(UNSAFE_getByType(Image), 'error', { nativeEvent: {} });

    expect(getByRole('image', { name: 'Photo' })).not.toBeBusy();
    expect(onError).toHaveBeenCalled();
  });

  it('shows the skeleton for a local image when asked, until it loads', () => {
    const { getByRole, UNSAFE_getByType } = render(
      <RemoteImage source={1} skeleton accessibilityLabel="Banner" />,
    );

    expect(getByRole('image', { name: 'Banner' })).toBeBusy();
    fireEvent(UNSAFE_getByType(Image), 'load', load());
    expect(getByRole('image', { name: 'Banner' })).not.toBeBusy();
  });

  it('has no skeleton for a local image', () => {
    const { getByRole } = render(
      <RemoteImage source={1} accessibilityLabel="Logo" />,
    );

    expect(getByRole('image', { name: 'Logo' })).not.toBeBusy();
  });

  it('keeps the top edge of a cropped cover picture with position="top"', () => {
    const { getByRole, UNSAFE_getByType } = render(
      <RemoteImage
        source={{ uri: 'https://example.com/a.jpg' }}
        accessibilityLabel="Photo"
        position="top"
      />,
    );

    fireEvent(getByRole('image', { name: 'Photo' }), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, width: 200, height: 100 } },
    });
    fireEvent(UNSAFE_getByType(Image), 'load', load(400, 600));

    // 400×600 scaled to cover 200×100 → 200×300, pinned to the top.
    expect(UNSAFE_getByType(Image).props.style).toMatchObject({
      top: 0,
      left: 0,
      width: 200,
      height: 300,
    });
  });
});
