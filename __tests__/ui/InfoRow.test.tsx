import { fireEvent, render } from '@tests/test-utils';

import { InfoRow } from '@/ui/components';

describe('InfoRow', () => {
  it('shows the label and value', () => {
    const { getByText, getByLabelText } = render(
      <InfoRow label="Members" value="15" />,
    );

    expect(getByText('15')).toBeTruthy();
    expect(getByLabelText('Members: 15')).toBeTruthy();
  });

  it('is a link when onPress is set', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <InfoRow
        label="Address"
        value="Stryiska 199"
        icon="location"
        onPress={onPress}
      />,
    );

    fireEvent.press(getByRole('link', { name: 'Address: Stryiska 199' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
