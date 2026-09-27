import { fireEvent, render } from '@tests/test-utils';

import { DateField } from '@/ui/components';

describe('DateField', () => {
  it('shows the value as day/month/year', () => {
    const { getByRole } = render(
      <DateField
        label="Date"
        value={new Date(1995, 10, 11)}
        onChange={jest.fn()}
      />,
    );

    expect(
      getByRole('button', { name: 'Date' }).props.accessibilityValue,
    ).toEqual({
      text: '11/11/1995',
    });
  });

  it('opens the calendar and returns the picked day', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <DateField
        label="Date"
        value={undefined}
        initialView={new Date(2026, 8, 1)}
        onChange={onChange}
      />,
    );

    fireEvent.press(getByRole('button', { name: 'Date' }));
    fireEvent.press(getByRole('button', { name: '15 9 2026' }));

    expect(onChange).toHaveBeenCalledWith(new Date(2026, 8, 15));
  });

  it('disables days before minDate', () => {
    const { getByRole } = render(
      <DateField
        label="Date"
        value={undefined}
        initialView={new Date(2026, 8, 1)}
        minDate={new Date(2026, 8, 10)}
        onChange={jest.fn()}
      />,
    );

    fireEvent.press(getByRole('button', { name: 'Date' }));

    expect(getByRole('button', { name: '9 9 2026' })).toBeDisabled();
    expect(getByRole('button', { name: '10 9 2026' })).toBeEnabled();
  });
});
