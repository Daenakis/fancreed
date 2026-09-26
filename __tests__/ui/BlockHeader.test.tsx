import { render } from '@tests/test-utils';
import {
  Image,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';

import { BlockHeader } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

const styleOf = (element: ReactTestInstance): ViewStyle & TextStyle =>
  StyleSheet.flatten(element.props.style);

const logo = { uri: 'https://example.com/logo.png' };

describe('BlockHeader', () => {
  it('renders the title as a header', () => {
    const { getByRole, getByText } = render(<BlockHeader title="Table" />);

    expect(getByRole('header')).toBeTruthy();
    expect(getByText('Table')).toBeTruthy();
  });

  it('uses primary colours when no colours are given', () => {
    const { getByRole, getByText } = render(<BlockHeader title="Table" />);

    expect(styleOf(getByRole('header')).backgroundColor).toBe(
      lightTheme.colors.primary,
    );
    expect(styleOf(getByText('Table')).color).toBe(
      lightTheme.colors.primaryForeground,
    );
  });

  it('applies the given theme colours', () => {
    const { getByRole, getByText } = render(
      <BlockHeader
        title="Table"
        backgroundColor="foreground"
        textColor="background"
      />,
    );

    expect(styleOf(getByRole('header')).backgroundColor).toBe(
      lightTheme.colors.foreground,
    );
    expect(styleOf(getByText('Table')).color).toBe(
      lightTheme.colors.background,
    );
  });

  it('centres the title in a column when there is no image', () => {
    const { getByRole } = render(<BlockHeader title="Table" />);

    expect(styleOf(getByRole('header')).flexDirection).toBe('column');
  });

  it('lays out a row with the image before the title when image is set', () => {
    const { getByRole, UNSAFE_getAllByType } = render(
      <BlockHeader title="Partners" image={logo} />,
    );

    expect(styleOf(getByRole('header')).flexDirection).toBe('row');
    expect(UNSAFE_getAllByType(Image)).toHaveLength(1);
  });

  it('renders both team logos when teamLogos is set', () => {
    const { UNSAFE_getAllByType } = render(
      <BlockHeader title="Votes" teamLogos={[logo, logo]} />,
    );

    expect(UNSAFE_getAllByType(Image)).toHaveLength(2);
  });

  it('adds side and bottom borders when bordered', () => {
    const { getByRole } = render(<BlockHeader title="Vote" bordered />);

    const style = styleOf(getByRole('header'));
    expect(style.borderColor).toBe(lightTheme.colors.foreground);
    expect(style.borderBottomWidth).toBeGreaterThan(0);
    expect(style.borderLeftWidth).toBeGreaterThan(0);
  });

  it('merges the style prop last', () => {
    const { getByRole } = render(
      <BlockHeader title="Table" style={{ minWidth: 10 }} />,
    );

    expect(styleOf(getByRole('header')).minWidth).toBe(10);
  });
});
