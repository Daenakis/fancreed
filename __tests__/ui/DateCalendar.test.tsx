import { fireEvent, render } from '@tests/test-utils';

import { DateCalendar } from '@/ui/components';

// i18n in tests returns keys, so month and weekday names fall back to numbers.
const value = new Date(1995, 10, 11);

describe('DateCalendar', () => {
  it('marks the picked day and picks another one', () => {
    const onChange = jest.fn();
    const { getAllByRole, getByRole } = render(
      <DateCalendar value={value} onChange={onChange} />,
    );
    const days = getAllByRole('button').filter(
      (b) => b.props.accessibilityState?.selected !== undefined,
    );
    const selected = days.filter((b) => b.props.accessibilityState.selected);

    expect(selected).toHaveLength(1);
    fireEvent.press(
      days.find((b) => b.props.children !== undefined && b !== selected[0])!,
    );
    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
  });

  it('switches to years and back to days after picking one', () => {
    const onChange = jest.fn();
    const { getByRole, queryByRole } = render(
      <DateCalendar
        value={value}
        onChange={onChange}
        minYear={1990}
        maxYear={2000}
      />,
    );

    fireEvent.press(getByRole('button', { name: '1995' }));
    fireEvent.press(getByRole('button', { name: '1998' }));

    expect(queryByRole('button', { name: '1990' })).toBeNull();
    expect(getByRole('button', { name: '1998' })).toBeTruthy();
  });
});

describe('DateCalendar maxDate', () => {
  it('disables the days after maxDate', () => {
    const { getByRole } = render(
      <DateCalendar
        value={null}
        onChange={jest.fn()}
        initialView={new Date(2026, 8, 1)}
        maxDate={new Date(2026, 8, 27)}
      />,
    );

    expect(getByRole('button', { name: '27 9 2026' })).toBeEnabled();
    expect(getByRole('button', { name: '28 9 2026' })).toBeDisabled();
  });
});
