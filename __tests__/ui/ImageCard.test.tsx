import { fireEvent, render } from '@tests/test-utils';
import {
  Image,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { ImageCard } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

const url = 'https://example.com/p.png';

describe('ImageCard', () => {
  it('shows the image from a URL and the title', () => {
    const { getByText, UNSAFE_getByType } = render(
      <ImageCard image={url} title="Ivan" />,
    );

    expect(getByText('Ivan')).toBeTruthy();
    expect(UNSAFE_getByType(Image).props.source).toEqual({ uri: url });
  });

  it('accepts a local image source', () => {
    const local = { uri: 'file:///podium.png' };
    const { UNSAFE_getByType } = render(<ImageCard image={local} />);

    expect(UNSAFE_getByType(Image).props.source).toBe(local);
  });

  it('shows a placeholder instead of the image when image is missing', () => {
    const { UNSAFE_queryAllByType } = render(
      <ImageCard image={null} title="Ivan" />,
    );

    expect(UNSAFE_queryAllByType(Image)).toHaveLength(0);
  });

  it('shows the subtitle under the title and reads both', () => {
    const { getByText, getByLabelText } = render(
      <ImageCard title="Ivan" subtitle="45%" />,
    );

    expect(getByText('Ivan\n45%')).toBeTruthy();
    expect(getByLabelText('Ivan, 45%')).toBeTruthy();
  });

  it('is only a button when onPress is set', () => {
    const onPress = jest.fn();
    const { queryByRole, rerender, getByRole } = render(
      <ImageCard title="Ivan" />,
    );
    expect(queryByRole('button')).toBeNull();

    rerender(<ImageCard title="Ivan" onPress={onPress} />);
    fireEvent.press(getByRole('button', { name: 'Ivan' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('uses the framed tile layout with a two-line caption when variant is tile', () => {
    const { getByText, getByLabelText } = render(
      <ImageCard variant="tile" image={url} title="Match day party" />,
    );
    const frame = getByLabelText('Match day party').children[0];
    if (typeof frame === 'string') throw new Error('expected the image frame');

    expect(getByText('Match day party').props.numberOfLines).toBe(2);
    expect(
      (StyleSheet.flatten(frame.props.style) as ViewStyle).backgroundColor,
    ).toBe(lightTheme.colors.translucentSurface);
  });

  it('applies the given text colour', () => {
    const { getByText } = render(
      <ImageCard title="Ivan" textColor="background" />,
    );

    expect(
      (StyleSheet.flatten(getByText('Ivan').props.style) as TextStyle).color,
    ).toBe(lightTheme.colors.background);
  });

  it('shows a cover image, title and 4-line description when variant is article', () => {
    const onPress = jest.fn();
    const { getByText, getByRole, UNSAFE_getByType } = render(
      <ImageCard
        variant="article"
        image={url}
        title="Big win"
        description="Rukh beat Vorskla 4:3 in a thriller."
        onPress={onPress}
      />,
    );

    expect(getByText('Big win')).toBeTruthy();
    expect(
      getByText('Rukh beat Vorskla 4:3 in a thriller.').props.numberOfLines,
    ).toBe(4);
    expect(UNSAFE_getByType(Image).props.resizeMode).toBe('cover');
    fireEvent.press(getByRole('button', { name: 'Big win' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
