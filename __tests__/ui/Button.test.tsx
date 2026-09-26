import { fireEvent, render } from '@tests/test-utils';
import {
  Image,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';

import { Button } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

const styleOf = (element: ReactTestInstance): ViewStyle & TextStyle =>
  StyleSheet.flatten(element.props.style);

const { colors } = lightTheme;
const icon = { uri: 'https://example.com/icon.png' };

describe('Button', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<Button text="Save" onPress={onPress} />);

    fireEvent.press(getByRole('button', { name: 'Save' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  describe('solid (default)', () => {
    it('uses foreground background and background label by default', () => {
      const { getByRole, getByText } = render(<Button text="Save" />);

      expect(styleOf(getByRole('button')).backgroundColor).toBe(
        colors.foreground,
      );
      expect(styleOf(getByText('Save')).color).toBe(colors.background);
    });

    it('applies custom theme colours', () => {
      const { getByRole, getByText } = render(
        <Button
          text="Go"
          backgroundColor="primary"
          textColor="primaryForeground"
        />,
      );

      expect(styleOf(getByRole('button')).backgroundColor).toBe(colors.primary);
      expect(styleOf(getByText('Go')).color).toBe(colors.primaryForeground);
    });

    it('dims and blocks presses when disabled', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <Button text="Save" onPress={onPress} disabled />,
      );

      fireEvent.press(getByRole('button'));

      expect(onPress).not.toHaveBeenCalled();
      expect(getByRole('button')).toBeDisabled();
      expect(styleOf(getByRole('button')).opacity).toBe(0.6);
    });
  });

  describe('outline', () => {
    it('is bordered and not selected by default', () => {
      const { getByRole } = render(<Button variant="outline" text="Option" />);
      const style = styleOf(getByRole('button'));

      expect(getByRole('button')).not.toBeSelected();
      expect(style.backgroundColor).toBe(colors.background);
      expect(style.borderColor).toBe(colors.border);
    });

    it('fills with primary colours when selected', () => {
      const { getByRole, getByText } = render(
        <Button variant="outline" text="Option" selected />,
      );

      expect(getByRole('button')).toBeSelected();
      expect(styleOf(getByRole('button')).backgroundColor).toBe(colors.primary);
      expect(styleOf(getByText('Option')).color).toBe(colors.primaryForeground);
    });
  });

  describe('brand', () => {
    it('is white with a brand-green label when active', () => {
      const { getByRole, getByText } = render(
        <Button variant="brand" text="Sign in" />,
      );

      expect(styleOf(getByRole('button')).backgroundColor).toBe(colors.onBrand);
      expect(styleOf(getByText('Sign in')).color).toBe(colors.brand);
    });

    it('turns dark green instead of dimming when disabled', () => {
      const { getByRole } = render(
        <Button variant="brand" text="Sign in" disabled />,
      );
      const style = styleOf(getByRole('button'));

      expect(style.backgroundColor).toBe(colors.brandStrong);
      expect(style.opacity).toBeUndefined();
    });
  });

  it('shows the image before the label when image is set', () => {
    const { UNSAFE_getAllByType } = render(<Button text="Save" image={icon} />);

    expect(UNSAFE_getAllByType(Image)).toHaveLength(1);
  });

  it('uses the bolder label when size is sm', () => {
    const { getByText } = render(<Button text="All" size="sm" />);

    expect(styleOf(getByText('All'))).toMatchObject(
      lightTheme.typography.h4Semibold,
    );
  });

  it('hides the label and blocks presses when loading', () => {
    const onPress = jest.fn();
    const { getByRole, queryByText } = render(
      <Button text="Save" onPress={onPress} loading />,
    );

    fireEvent.press(getByRole('button'));

    expect(queryByText('Save')).toBeNull();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('stretches to the parent width when fullWidth', () => {
    const { getByRole } = render(<Button text="Save" fullWidth />);

    expect(styleOf(getByRole('button')).alignSelf).toBe('stretch');
  });

  it('merges the style prop last', () => {
    const { getByRole } = render(
      <Button text="Save" style={{ marginTop: 20 }} />,
    );

    expect(styleOf(getByRole('button')).marginTop).toBe(20);
  });
});
