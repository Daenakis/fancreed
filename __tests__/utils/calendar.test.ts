import { calendarDays, formatDayMonthYear, isSameDay } from '@/utils';

describe('calendarDays', () => {
  it('starts on Monday with the previous month padding', () => {
    // 1 November 1995 was a Wednesday.
    const days = calendarDays(1995, 10);

    expect(days[0]!.date.getDate()).toBe(30);
    expect(days[0]!.inMonth).toBe(false);
    expect(days[2]!.date.getDate()).toBe(1);
    expect(days[2]!.inMonth).toBe(true);
  });

  it('fills whole weeks with the next month days', () => {
    const days = calendarDays(1995, 10);

    expect(days).toHaveLength(35);
    expect(days.at(-1)!.date.getDate()).toBe(3);
    expect(days.at(-1)!.inMonth).toBe(false);
  });

  it('needs no padding when the month starts on Monday', () => {
    // 1 September 2025 was a Monday.
    expect(calendarDays(2025, 8)[0]!.date.getDate()).toBe(1);
  });
});

describe('isSameDay', () => {
  it('ignores the time of day', () => {
    expect(isSameDay(new Date(2020, 1, 3, 1), new Date(2020, 1, 3, 23))).toBe(
      true,
    );
  });

  it('tells different days apart', () => {
    expect(isSameDay(new Date(2020, 1, 3), new Date(2020, 1, 4))).toBe(false);
  });
});

describe('formatDayMonthYear', () => {
  it('pads day and month with zeros', () => {
    expect(formatDayMonthYear(new Date(1995, 0, 5))).toBe('05/01/1995');
  });
});
