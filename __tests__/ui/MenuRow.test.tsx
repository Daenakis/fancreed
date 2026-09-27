import { fireEvent, render } from '@tests/test-utils';
import { StyleSheet, type TextStyle } from 'react-native';

import { MenuRow } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

describe('MenuRow', () => {
  it('shows the value and calls onPress', () => {
    const onPress = jest.fn();
    const { getByRole, getByText } = render(
      <MenuRow label="Size" icon="tShirt" value="M" onPress={onPress} />,
    );

    fireEvent.press(getByRole('button', { name: 'Size, M' }));

    expect(getByText('M')).toBeTruthy();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('uses the destructive colour when tone is destructive', () => {
    const { getByText } = render(
      <MenuRow
        label="Log out"
        icon="logout"
        tone="destructive"
        onPress={jest.fn()}
      />,
    );

    expect(
      (StyleSheet.flatten(getByText('Log out').props.style) as TextStyle).color,
    ).toBe(lightTheme.colors.destructive);
  });
});
