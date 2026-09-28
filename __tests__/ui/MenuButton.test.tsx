import { fireEvent, render } from '@tests/test-utils';

import { MenuButton } from '@/ui/components';

describe('MenuButton', () => {
  it('is the menu button when closed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<MenuButton open={false} onPress={onPress} />);

    const button = getByRole('button', { name: 'nav.menu' });
    expect(button).toBeCollapsed();

    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('becomes the close button when open', () => {
    const { getByRole } = render(<MenuButton open onPress={jest.fn()} />);

    expect(getByRole('button', { name: 'common.close' })).toBeExpanded();
  });

  it('is inactive when disabled', () => {
    const { getByRole } = render(<MenuButton open={false} disabled />);

    expect(getByRole('button', { name: 'nav.menu' })).toBeDisabled();
  });
});
