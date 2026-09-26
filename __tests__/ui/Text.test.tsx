import { render } from '@tests/test-utils';
import { StyleSheet, type TextStyle } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';

import { Text } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

const styleOf = (element: ReactTestInstance): TextStyle =>
  StyleSheet.flatten(element.props.style);

describe('Text', () => {
  it('renders its children', () => {
    const { getByText } = render(<Text>Hello</Text>);

    expect(getByText('Hello')).toBeTruthy();
  });

  it('uses bodyLRegular and foreground colour when no props are given', () => {
    const { getByText } = render(<Text>Default</Text>);

    expect(styleOf(getByText('Default'))).toMatchObject({
      ...lightTheme.typography.bodyLRegular,
      color: lightTheme.colors.foreground,
    });
  });

  it('applies the typography of the given variant', () => {
    const { getByText } = render(<Text variant="h1Semibold">Title</Text>);

    expect(styleOf(getByText('Title'))).toMatchObject(
      lightTheme.typography.h1Semibold,
    );
  });

  it('applies the given theme colour token', () => {
    const { getByText } = render(<Text color="destructive">Error</Text>);

    expect(styleOf(getByText('Error')).color).toBe(
      lightTheme.colors.destructive,
    );
  });

  it('lets the style prop override variant styles', () => {
    const { getByText } = render(
      <Text
        variant="bodyMRegular"
        style={{ textAlign: 'center', fontSize: 40 }}
      >
        Custom
      </Text>,
    );

    expect(styleOf(getByText('Custom'))).toMatchObject({
      textAlign: 'center',
      fontSize: 40,
      fontFamily: lightTheme.typography.bodyMRegular.fontFamily,
    });
  });

  it('passes accessibility props through', () => {
    const { getByRole } = render(
      <Text accessibilityRole="header">Heading</Text>,
    );

    expect(getByRole('header')).toBeTruthy();
  });
});
