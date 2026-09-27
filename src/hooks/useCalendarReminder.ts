import * as Calendar from 'expo-calendar/legacy';
import { Platform } from 'react-native';

export type CalendarReminder = {
  title: string;
  start: Date;
  /** Defaults to two hours after the start. */
  end?: Date;
  location?: string;
  /** Alert this many minutes before the start. */
  minutesBefore: number;
};

/** `added`, or why the event couldn't be added. */
export type ReminderResult = 'added' | 'denied' | 'failed';

async function writableCalendarId(): Promise<string | null> {
  if (Platform.OS === 'ios') {
    return (await Calendar.getDefaultCalendarAsync()).id;
  }
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT,
  );
  const writable = calendars.filter((c) => c.allowsModifications);
  return (writable.find((c) => c.isPrimary) ?? writable[0])?.id ?? null;
}

/**
 * Adds an event to the phone's calendar with an alert before it — the
 * app's "remind me" (asks for calendar access the first time).
 */
export function useCalendarReminder() {
  return async ({
    title,
    start,
    end,
    location,
    minutesBefore,
  }: CalendarReminder): Promise<ReminderResult> => {
    try {
      const { granted } = await Calendar.requestCalendarPermissionsAsync();
      if (!granted) return 'denied';
      const calendarId = await writableCalendarId();
      if (!calendarId) return 'failed';
      await Calendar.createEventAsync(calendarId, {
        title,
        startDate: start,
        endDate: end ?? new Date(start.getTime() + 2 * 60 * 60 * 1000),
        location,
        alarms: [{ relativeOffset: -minutesBefore }],
      });
      return 'added';
    } catch {
      return 'failed';
    }
  };
}
