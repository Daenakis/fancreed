import { fireEvent, render } from '@tests/test-utils';
import { ActivityIndicator, Image } from 'react-native';

import { AddPhoto } from '@/ui/components';

const photo = 'https://example.com/me.png';

describe('AddPhoto', () => {
  it('offers to add a photo when there is none', () => {
    const { getByRole, UNSAFE_queryAllByType } = render(
      <AddPhoto onPress={jest.fn()} />,
    );

    expect(getByRole('button', { name: 'photo.add' })).toBeTruthy();
    expect(UNSAFE_queryAllByType(Image)).toHaveLength(0);
  });

  it('shows the photo and offers to change it when photo is set', () => {
    const { getByRole, UNSAFE_getAllByType } = render(
      <AddPhoto onPress={jest.fn()} photo={photo} />,
    );

    expect(getByRole('button', { name: 'photo.change' })).toBeTruthy();
    expect(UNSAFE_getAllByType(Image)).toHaveLength(1);
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<AddPhoto onPress={onPress} />);

    fireEvent.press(getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is view-only and ignores presses when disabled', () => {
    const onPress = jest.fn();
    const { getByRole, queryByRole } = render(
      <AddPhoto onPress={onPress} photo={photo} disabled />,
    );

    fireEvent.press(getByRole('image', { name: 'photo.label' }));

    expect(queryByRole('button')).toBeNull();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows a spinner and ignores presses while uploading', () => {
    const onPress = jest.fn();
    const { getByRole, UNSAFE_getAllByType } = render(
      <AddPhoto onPress={onPress} uploading />,
    );

    fireEvent.press(getByRole('button'));

    expect(UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
    expect(onPress).not.toHaveBeenCalled();
  });
});
