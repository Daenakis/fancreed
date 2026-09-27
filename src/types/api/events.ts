// Backend group "events" — matchday and club events. Needs an activated account.

export type AppEvent = {
  _id: string;
  type: string;
  /** Start time: ISO string or unix time (seconds). */
  time: string | number;
  title: string;
  location: string;
  coords?: { latitude: number; longitude: number } | null;
};

export type EventsListResponse = {
  events: AppEvent[];
};

export type ClubEventKind = 'trip' | 'meeting' | 'party';

export type ClubEvent = AppEvent & {
  kind?: ClubEventKind;
  club?: { _id: string; name?: string };
};

export type ClubEventsListResponse = {
  events: ClubEvent[];
};
