import { fireEvent, render } from '@tests/test-utils';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';

import { Button } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

const source = { uri: 'https://example.com/icon.png' };

const styleOf = (element: ReactTestInstance): ViewStyle & TextStyle =>
  StyleSheet.flatten(element.props.style);

describe('Button', () => {
  it('renders its label as an accessible button', () => {
    const { getByRole } = render(<Button source={source} text="Save" />);

    expect(getByRole('button', { name: 'Save' })).toBeTruthy();
  });

  it('calls onPress when pressed and no onChoose is given', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button source={source} text="Save" onPress={onPress} />,
    );

    fireEvent.press(getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('calls onChoose instead of onPress when both are given', () => {
    const onPress = jest.fn();
    const onChoose = jest.fn();
    const { getByRole } = render(
      <Button
        source={source}
        text="Option"
        onPress={onPress}
        onChoose={onChoose}
      />,
    );

    fireEvent.press(getByRole('button'));

    expect(onChoose).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button source={source} text="Save" onPress={onPress} disabled />,
    );

    fireEvent.press(getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
    expect(getByRole('button')).toBeDisabled();
  });

  it('is not selected and uses the background colour by default', () => {
    const { getByRole, getByText } = render(
      <Button source={source} text="Option" />,
    );

    expect(getByRole('button')).not.toBeSelected();
    expect(styleOf(getByRole('button')).backgroundColor).toBe(
      lightTheme.colors.background,
    );
    expect(styleOf(getByText('Option')).color).toBe(
      lightTheme.colors.foreground,
    );
  });

  it('is selected with primary colours when choosen', () => {
    const { getByRole, getByText } = render(
      <Button source={source} text="Option" choosen />,
    );

    expect(getByRole('button')).toBeSelected();
    expect(styleOf(getByRole('button')).backgroundColor).toBe(
      lightTheme.colors.primary,
    );
    expect(styleOf(getByText('Option')).color).toBe(
      lightTheme.colors.primaryForeground,
    );
  });

  it('merges the style prop last', () => {
    const { getByRole } = render(
      <Button source={source} text="Save" style={{ width: 120 }} />,
    );

    expect(styleOf(getByRole('button')).width).toBe(120);
  });
});
