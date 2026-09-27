import { fireEvent, render } from '@tests/test-utils';

import { Select } from '@/ui/components';

const options = [
  { label: 'Premier League 2025/26', value: 333 },
  { label: 'Cup 2025/26', value: 335 },
];

describe('Select', () => {
  it('shows the picked option in the field', () => {
    const { getByRole } = render(
      <Select
        label="League"
        options={options}
        value={335}
        onChange={jest.fn()}
      />,
    );

    expect(
      getByRole('button', { name: 'League' }).props.accessibilityValue,
    ).toEqual({
      text: 'Cup 2025/26',
    });
  });

  it('opens the options and picks one', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <Select
        label="League"
        options={options}
        value={333}
        onChange={onChange}
      />,
    );

    fireEvent.press(getByRole('button', { name: 'League' }));
    expect(
      getByRole('radio', { name: 'Premier League 2025/26' }),
    ).toBeChecked();
    fireEvent.press(getByRole('radio', { name: 'Cup 2025/26' }));

    expect(onChange).toHaveBeenCalledWith(335);
  });

  it('shows the placeholder while nothing is picked', () => {
    const { getByText } = render(
      <Select
        label="League"
        placeholder="Choose"
        options={options}
        value={null}
        onChange={jest.fn()}
      />,
    );

    expect(getByText('Choose')).toBeTruthy();
  });
});
