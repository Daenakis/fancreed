import { fireEvent, render } from '@tests/test-utils';

import { BottomSheet, Text } from '@/ui/components';

describe('BottomSheet', () => {
  it('shows the title and content when visible', () => {
    const { getByRole, getByText } = render(
      <BottomSheet visible onClose={jest.fn()} title="Size">
        <Text>M</Text>
      </BottomSheet>,
    );

    expect(getByRole('header', { name: 'Size' })).toBeTruthy();
    expect(getByText('M')).toBeTruthy();
  });

  it('closes when the backdrop is pressed', () => {
    const onClose = jest.fn();
    const { getByRole } = render(
      <BottomSheet visible onClose={onClose}>
        <Text>M</Text>
      </BottomSheet>,
    );

    fireEvent.press(getByRole('button', { name: 'common.close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
