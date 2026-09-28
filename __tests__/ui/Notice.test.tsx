import { render } from '@tests/test-utils';
import { StyleSheet, type TextStyle } from 'react-native';

import { Notice } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

describe('Notice', () => {
  it('shows the text and reads it as one element', () => {
    const { getByText, getByLabelText } = render(
      <Notice text="Fill in your profile" />,
    );

    expect(getByText('Fill in your profile')).toBeTruthy();
    expect(getByLabelText('Fill in your profile')).toBeTruthy();
  });

  it('uses 2 px larger text with large', () => {
    const { getByText } = render(<Notice large text="Fill in" />);

    expect(
      (StyleSheet.flatten(getByText('Fill in').props.style) as TextStyle)
        .fontSize,
    ).toBe(lightTheme.typography.bodySMedium.fontSize);
  });
});
