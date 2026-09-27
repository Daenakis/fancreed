import { renderHook } from '@testing-library/react-native';
import * as Calendar from 'expo-calendar/legacy';

import { useCalendarReminder } from '@/hooks';

const remind = renderHook(() => useCalendarReminder()).result.current;
const start = new Date(2026, 8, 27, 18, 0);

describe('useCalendarReminder', () => {
  it('adds the event with an alert before it to the default calendar', async () => {
    jest
      .mocked(Calendar.requestCalendarPermissionsAsync)
      .mockResolvedValue({ granted: true } as never);
    jest
      .mocked(Calendar.getDefaultCalendarAsync)
      .mockResolvedValue({ id: 'cal' } as never);
    jest.mocked(Calendar.createEventAsync).mockResolvedValue('ev');

    await expect(
      remind({
        title: 'Matchday',
        start,
        location: 'Arena',
        minutesBefore: 15,
      }),
    ).resolves.toBe('added');
    expect(Calendar.createEventAsync).toHaveBeenCalledWith('cal', {
      title: 'Matchday',
      startDate: start,
      endDate: new Date(2026, 8, 27, 20, 0),
      location: 'Arena',
      alarms: [{ relativeOffset: -15 }],
    });
  });

  it('reports a denied calendar permission', async () => {
    jest
      .mocked(Calendar.requestCalendarPermissionsAsync)
      .mockResolvedValue({ granted: false } as never);

    await expect(
      remind({ title: 'x', start, minutesBefore: 10 }),
    ).resolves.toBe('denied');
  });

  it('reports a failure instead of throwing', async () => {
    jest
      .mocked(Calendar.requestCalendarPermissionsAsync)
      .mockRejectedValue(new Error('boom'));

    await expect(
      remind({ title: 'x', start, minutesBefore: 10 }),
    ).resolves.toBe('failed');
  });
});
