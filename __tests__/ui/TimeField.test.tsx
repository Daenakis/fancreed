import { fireEvent, render } from '@tests/test-utils';

import { TimeField } from '@/ui/components';

describe('TimeField', () => {
  it('opens the slots and returns the picked time', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <TimeField label="Time" value={null} onChange={onChange} />,
    );

    fireEvent.press(getByRole('button', { name: 'Time' }));
    fireEvent.press(getByRole('button', { name: '18:30' }));

    expect(onChange).toHaveBeenCalledWith('18:30');
  });

  it('marks the picked slot and disables the given ones', () => {
    const { getByRole } = render(
      <TimeField
        label="Time"
        value="10:00"
        slots={['09:00', '10:00']}
        isDisabled={(time) => time === '09:00'}
        onChange={jest.fn()}
      />,
    );

    fireEvent.press(getByRole('button', { name: 'Time' }));

    expect(getByRole('button', { name: '10:00' })).toBeSelected();
    expect(getByRole('button', { name: '09:00' })).toBeDisabled();
  });
});
