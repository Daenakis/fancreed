import { fireEvent, render } from '@tests/test-utils';

import { SegmentedControl } from '@/ui/components';

const options = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

describe('SegmentedControl', () => {
  it('renders one radio per option with the selected one checked', () => {
    const { getByRole } = render(
      <SegmentedControl
        options={options}
        value="female"
        onChange={jest.fn()}
      />,
    );

    expect(getByRole('radio', { name: 'Male' })).not.toBeChecked();
    expect(getByRole('radio', { name: 'Female' })).toBeChecked();
  });

  it('selects nothing when the value matches no option', () => {
    const { getAllByRole } = render(
      <SegmentedControl options={options} value={null} onChange={jest.fn()} />,
    );

    getAllByRole('radio').forEach((radio) => expect(radio).not.toBeChecked());
  });

  it('calls onChange with the pressed option value', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <SegmentedControl options={options} value="male" onChange={onChange} />,
    );

    fireEvent.press(getByRole('radio', { name: 'Female' }));

    expect(onChange).toHaveBeenCalledWith('female');
  });

  it('supports three options and a caption', () => {
    const { getAllByRole, getByText } = render(
      <SegmentedControl
        options={[...options, { label: 'Other', value: 'other' }]}
        value="other"
        onChange={jest.fn()}
        caption="Gender *"
      />,
    );

    expect(getAllByRole('radio')).toHaveLength(3);
    expect(getByText('Gender *')).toBeTruthy();
  });
});
