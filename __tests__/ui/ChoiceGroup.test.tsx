import { fireEvent, render } from '@tests/test-utils';

import { ChoiceGroup } from '@/ui/components';

const options = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

describe('ChoiceGroup', () => {
  it('renders one radio per option with the selected one checked', () => {
    const { getByRole } = render(
      <ChoiceGroup options={options} value="female" onChange={jest.fn()} />,
    );

    expect(getByRole('radio', { name: 'Male' })).not.toBeChecked();
    expect(getByRole('radio', { name: 'Female' })).toBeChecked();
  });

  it('selects nothing when the value matches no option', () => {
    const { getAllByRole } = render(
      <ChoiceGroup options={options} value={null} onChange={jest.fn()} />,
    );

    getAllByRole('radio').forEach((radio) => expect(radio).not.toBeChecked());
  });

  it('calls onChange with the pressed option value', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <ChoiceGroup options={options} value="male" onChange={onChange} />,
    );

    fireEvent.press(getByRole('radio', { name: 'Female' }));

    expect(onChange).toHaveBeenCalledWith('female');
  });

  it('supports three options and a caption', () => {
    const { getAllByRole, getByText } = render(
      <ChoiceGroup
        options={[...options, { label: 'Other', value: 'other' }]}
        value="other"
        onChange={jest.fn()}
        caption="Gender *"
      />,
    );

    expect(getAllByRole('radio')).toHaveLength(3);
    expect(getByText('Gender *')).toBeTruthy();
  });

  describe('radio variant', () => {
    const answers = [
      { label: 'Stepanenko', value: 1 },
      { label: 'Rotan', value: 2 },
      {
        label: 'A very long answer that has to wrap onto the next line',
        value: 3,
      },
    ];

    it('renders a checked radio for the selected answer', () => {
      const { getByRole } = render(
        <ChoiceGroup
          variant="radio"
          options={answers}
          value={2}
          onChange={jest.fn()}
        />,
      );

      expect(getByRole('radio', { name: 'Rotan' })).toBeChecked();
      expect(getByRole('radio', { name: 'Stepanenko' })).not.toBeChecked();
    });

    it('calls onChange with the pressed answer value', () => {
      const onChange = jest.fn();
      const { getByRole } = render(
        <ChoiceGroup
          variant="radio"
          options={answers}
          value={1}
          onChange={onChange}
        />,
      );

      fireEvent.press(getByRole('radio', { name: answers[2].label }));

      expect(onChange).toHaveBeenCalledWith(3);
    });
  });

  it('shows tabs and marks the selected one when variant is tabs', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <ChoiceGroup
        variant="tabs"
        options={[
          { label: 'Calendar', value: 'upcoming' },
          { label: 'Results', value: 'results' },
        ]}
        value="upcoming"
        onChange={onChange}
      />,
    );

    expect(getByRole('tab', { name: 'Calendar' })).toBeSelected();
    fireEvent.press(getByRole('tab', { name: 'Results' }));
    expect(onChange).toHaveBeenCalledWith('results');
  });
});
