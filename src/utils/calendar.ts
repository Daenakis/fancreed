export type CalendarDay = {
  date: Date;
  /** `false` for the leading/trailing days of the neighbouring months. */
  inMonth: boolean;
};

/**
 * Days of a month view, Monday first, padded with the neighbouring months'
 * days to full weeks. `month` is 0-based.
 */
export function calendarDays(year: number, month: number): CalendarDay[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // Monday = 0
  const inMonth = new Date(year, month + 1, 0).getDate();
  const total = Math.ceil((lead + inMonth) / 7) * 7;

  return Array.from({ length: total }, (_, i) => {
    const date = new Date(year, month, i - lead + 1);
    return { date, inMonth: date.getMonth() === month };
  });
}

/** Same calendar day, ignoring time. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** "11/11/1995" — day/month/year with leading zeros. */
export function formatDayMonthYear(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}
