import { fireEvent, render } from '@tests/test-utils';
import { Image, StyleSheet, type TextStyle } from 'react-native';

import { PlayerItem } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

describe('PlayerItem', () => {
  it('shows the photo and name', () => {
    const { getByText, UNSAFE_getAllByType } = render(
      <PlayerItem image="https://example.com/p.png" name="Ivan" />,
    );

    expect(getByText('Ivan')).toBeTruthy();
    expect(UNSAFE_getAllByType(Image)).toHaveLength(1);
  });

  it('shows a placeholder instead of the photo when image is missing', () => {
    const { UNSAFE_queryAllByType } = render(
      <PlayerItem image={null} name="Ivan" />,
    );

    expect(UNSAFE_queryAllByType(Image)).toHaveLength(0);
  });

  it('shows the vote share under the name when percent is set', () => {
    const { getByText, getByLabelText } = render(
      <PlayerItem name="Ivan" percent={45} />,
    );

    expect(getByText('Ivan\n45%')).toBeTruthy();
    expect(getByLabelText('Ivan, 45%')).toBeTruthy();
  });

  it('is not a button when onPress is missing', () => {
    const { queryByRole } = render(<PlayerItem name="Ivan" />);

    expect(queryByRole('button')).toBeNull();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<PlayerItem name="Ivan" onPress={onPress} />);

    fireEvent.press(getByRole('button', { name: 'Ivan' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('applies the given text colour', () => {
    const { getByText } = render(
      <PlayerItem name="Ivan" textColor="background" />,
    );

    expect(
      (StyleSheet.flatten(getByText('Ivan').props.style) as TextStyle).color,
    ).toBe(lightTheme.colors.background);
  });
});
