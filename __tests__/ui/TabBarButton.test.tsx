import { fireEvent, render } from '@tests/test-utils';

import { TabBarButton } from '@/ui/components';

describe('TabBarButton', () => {
  it('is a tab that is not selected by default', () => {
    const { getByRole } = render(<TabBarButton icon="home" label="Home" />);

    expect(getByRole('tab', { name: 'Home' })).not.toBeSelected();
  });

  it('is selected when focused', () => {
    const { getByRole } = render(
      <TabBarButton icon="home" activeIcon="homeFill" label="Home" isFocused />,
    );

    expect(getByRole('tab', { name: 'Home' })).toBeSelected();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <TabBarButton icon="shop" label="Shop" onPress={onPress} />,
    );

    fireEvent.press(getByRole('tab', { name: 'Shop' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows no selection when inactive even if its tab is focused', () => {
    const { getByRole } = render(
      <TabBarButton icon="home" label="Home" isFocused inactive />,
    );

    expect(getByRole('tab', { name: 'Home' })).not.toBeSelected();
  });
});
