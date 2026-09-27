import { fireEvent, render } from '@tests/test-utils';
import { StyleSheet, type TextStyle } from 'react-native';

import { SectionTitle } from '@/ui/components';
import { lightTheme } from '@/ui/theme/unistyles';

describe('SectionTitle', () => {
  it('renders the title as a header', () => {
    const { getByRole } = render(<SectionTitle title="Latest news" />);

    expect(getByRole('header', { name: 'Latest news' })).toBeTruthy();
  });

  it('applies the given colour', () => {
    const { getByText } = render(
      <SectionTitle title="Links" color="onBrand" />,
    );

    expect(
      (StyleSheet.flatten(getByText('Links').props.style) as TextStyle).color,
    ).toBe(lightTheme.colors.onBrand);
  });

  it('shows the action button and calls it', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <SectionTitle
        title="Fan clubs"
        action={{ icon: 'plus', label: 'Create', onPress }}
      />,
    );

    fireEvent.press(getByRole('button', { name: 'Create' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
