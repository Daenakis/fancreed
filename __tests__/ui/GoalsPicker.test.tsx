import { fireEvent, render } from '@tests/test-utils';

import { GoalsPicker } from '@/ui/components';

const setup = (value: number | null, readOnly = false) => {
  const onChange = jest.fn();
  const utils = render(
    <GoalsPicker
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      accessibilityLabel="Rukh"
    />,
  );
  return { ...utils, onChange };
};

describe('GoalsPicker', () => {
  it('shows "?" until a value is picked', () => {
    const { getByText } = setup(null);

    expect(getByText('?')).toBeTruthy();
  });

  it('starts at 0 when an arrow is pressed for the first time', () => {
    const { getByRole, onChange } = setup(null);

    fireEvent.press(getByRole('button', { name: 'goals.less' }));

    expect(onChange).toHaveBeenCalledWith(0);
  });

  it.each([
    [3, 'goals.more', 4],
    [3, 'goals.less', 2],
    [9, 'goals.more', 0],
    [0, 'goals.less', 9],
  ])(
    'changes %i to the expected value when %s is pressed',
    (value, button, expected) => {
      const { getByRole, onChange } = setup(value);

      fireEvent.press(getByRole('button', { name: button }));

      expect(onChange).toHaveBeenCalledWith(expected);
    },
  );

  it('supports screen-reader increment and decrement', () => {
    const { getByRole, onChange } = setup(5);
    const picker = getByRole('adjustable', { name: 'Rukh' });

    fireEvent(picker, 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });

    expect(onChange).toHaveBeenCalledWith(6);
    expect(picker.props.accessibilityValue).toEqual({ text: '5' });
  });

  it('hides the arrows when readOnly', () => {
    const { queryByRole, getByText } = setup(2, true);

    expect(queryByRole('button')).toBeNull();
    expect(getByText('2')).toBeTruthy();
  });
});
