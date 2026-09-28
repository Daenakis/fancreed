import { fireEvent, render } from '@tests/test-utils';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';

import { Text, TextInput } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

const styleOf = (element: ReactTestInstance): ViewStyle & TextStyle =>
  StyleSheet.flatten(element.props.style);

// The bordered field is the closest ancestor with a border.
const fieldOf = (input: ReactTestInstance) => {
  let node = input.parent;
  while (node && styleOf(node)?.borderWidth === undefined) node = node.parent;
  return styleOf(node!);
};

describe('TextInput', () => {
  it('shows the label and uses it as the accessibility label', () => {
    const { getByText, getByLabelText } = render(<TextInput label="Email" />);

    expect(getByText('Email')).toBeTruthy();
    expect(getByLabelText('Email')).toBeTruthy();
  });

  it('calls onChangeText with the typed text', () => {
    const onChangeText = jest.fn();
    const { getByLabelText } = render(
      <TextInput label="Email" onChangeText={onChangeText} />,
    );

    fireEvent.changeText(getByLabelText('Email'), 'a@b.c');

    expect(onChangeText).toHaveBeenCalledWith('a@b.c');
  });

  it('highlights the border and forwards callbacks when focused', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { getByLabelText } = render(
      <TextInput label="Email" onFocus={onFocus} onBlur={onBlur} />,
    );
    const input = getByLabelText('Email');

    fireEvent(input, 'focus');
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(fieldOf(input).borderColor).toBe(lightTheme.colors.ring);

    fireEvent(input, 'blur');
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(fieldOf(input).borderColor).toBe(lightTheme.colors.border);
  });

  it('shows the error and a destructive border when error is set', () => {
    const { getByText, getByLabelText } = render(
      <TextInput label="Email" error="Required" />,
    );

    expect(getByText('Required')).toBeTruthy();
    expect(fieldOf(getByLabelText('Email')).borderColor).toBe(
      lightTheme.colors.destructive,
    );
  });

  it('is not editable and is dimmed when disabled', () => {
    const { getByLabelText } = render(<TextInput label="Email" disabled />);
    const input = getByLabelText('Email');

    expect(input.props.editable).toBe(false);
    expect(fieldOf(input).backgroundColor).toBe(lightTheme.colors.muted);
  });

  it('hides the password and toggles visibility when secureTextEntry is set', () => {
    const { getByLabelText, getByRole } = render(
      <TextInput label="Password" secureTextEntry />,
    );

    expect(getByLabelText('Password').props.secureTextEntry).toBe(true);

    fireEvent.press(getByRole('button', { name: 'common.showPassword' }));

    expect(getByLabelText('Password').props.secureTextEntry).toBe(false);
    expect(getByRole('button', { name: 'common.hidePassword' })).toBeTruthy();
  });

  it('uses brand-surface colours when variant is inverse', () => {
    const { getByLabelText } = render(
      <TextInput label="Email" variant="inverse" />,
    );
    const input = getByLabelText('Email');

    expect(styleOf(input).color).toBe(lightTheme.colors.onBrand);
    expect(fieldOf(input).borderColor).toBe(lightTheme.colors.brandBorder);
    expect(fieldOf(input).backgroundColor).toBe(lightTheme.colors.brandSurface);
  });

  it('renders the right accessory when given', () => {
    const { getByText } = render(
      <TextInput label="Password" rightAccessory={<Text>Forgot?</Text>} />,
    );

    expect(getByText('Forgot?')).toBeTruthy();
  });

  it('merges the style prop last', () => {
    const { getByLabelText } = render(
      <TextInput label="Email" style={{ textAlign: 'center' }} />,
    );

    expect(styleOf(getByLabelText('Email')).textAlign).toBe('center');
  });

  it('shows the prefix before the value when prefix is set', () => {
    const { getByText } = render(
      <TextInput label="Phone" prefix="+38" keyboardType="phone-pad" />,
    );

    expect(getByText('+38')).toBeTruthy();
  });

  it('keeps a red border and red message on the brand variant while an error shows, even when focused', () => {
    const { getByLabelText, getByText } = render(
      <TextInput label="Email" variant="inverse" error="Wrong" />,
    );
    const input = getByLabelText('Email');

    fireEvent(input, 'focus');

    expect(fieldOf(input).borderColor).toBe(lightTheme.colors.destructive);
    expect(
      (StyleSheet.flatten(getByText('Wrong').props.style) as TextStyle).color,
    ).toBe(lightTheme.colors.destructive);
  });

  it('makes the label and the value 2 px larger with large', () => {
    const { getByText, getByLabelText } = render(
      <TextInput large label="Name" value="Ivan" />,
    );

    expect(styleOf(getByText('Name')).fontSize).toBe(
      lightTheme.typography.bodyLMedium.fontSize,
    );
    expect(styleOf(getByLabelText('Name')).fontSize).toBe(
      lightTheme.typography.h4Regular.fontSize,
    );
  });
});
