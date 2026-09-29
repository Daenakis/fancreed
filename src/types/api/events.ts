// Backend group "events" — matchday and club events. Needs an activated account.

export type AppEvent = {
  _id: string;
  type: string;
  /** Start time: ISO string, unix time (seconds) or a bare "HH:mm" (old matchday events). */
  time: string | number;
  title: string;
  location: string;
  /** Texts per app language; `title`/`location` are the fallback. */
  translations?: Partial<
    Record<
      'en' | 'uk',
      { title?: string; location?: string; description?: string }
    >
  > | null;
  /** Old records may carry only one of the two. */
  coords?: { latitude?: number; longitude?: number } | null;
};

export type EventsListResponse = {
  events: AppEvent[];
};

export type ClubEventKind = 'trip' | 'meeting' | 'party';

/** A place of a club event (backend `locations`). */
export type EventLocation = {
  location?: string;
  coords?: { latitude: number; longitude: number } | null;
};

export type ClubEvent = AppEvent & {
  kind?: ClubEventKind;
  club?: { _id: string; name?: string };
  description?: string;
  /** Unix seconds. */
  startDate?: number;
  endDate?: number;
  /** Match the event is organised around (fixture `_id`). */
  fixture?: number | null;
  /** Joined fans (shape not in the apidoc — only the count is used). */
  members?: unknown[];
  /** Members besides the owner. */
  totalMembers?: number;
  locations?: EventLocation[];
  owner?: { name?: string | null; surname?: string | null } | null;
  opened?: boolean;
  youOwner?: boolean;
  youMember?: boolean;
};

export type ClubEventResponse = {
  event: ClubEvent;
};

/** `POST clubs/:clubId/events/create`. */
export type CreateClubEventRequest = {
  type: 'club';
  opened: boolean;
  visible: boolean;
  kind: ClubEventKind;
  title: string;
  description: string;
  /** Unix seconds. */
  startDate: number;
  endDate: number;
  fixture?: number;
};

/** `POST clubs/:clubId/events/:eventId/locations/:index`. */
export type SetEventLocationRequest = {
  location: string;
  coords: { latitude: number; longitude: number };
};

export type ClubEventsListResponse = {
  events: ClubEvent[];
};
