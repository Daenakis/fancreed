import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "clubs" (fan clubs and their events). */
export const clubsApi = {
  list: (index = 0) =>
    axiosInstance.get<T.ClubsListResponse>(`clubs/list/${index}`),
  /** Clubs the fan owns or belongs to. */
  self: (index = 0) =>
    axiosInstance.get<T.ClubsListResponse>(`clubs/self/list/${index}`),
  one: (id: string) => axiosInstance.get<T.ClubResponse>(`clubs/one/${id}`),

  create: (params: T.CreateClubRequest) =>
    axiosInstance.post<T.ClubResponse>('clubs/create', params),
  setPhoto: (id: string, params: T.SetClubPhotoRequest) =>
    axiosInstance.post<T.ClubResponse>(`clubs/${id}/setphoto`, params),
  // Open clubs need no invite code.
  join: (id: string) => axiosInstance.post<void>(`clubs/join/${id}`, {}),
  leave: (id: string) => axiosInstance.get<void>(`clubs/leave/${id}`),

  events: (clubId: string, index = 0) =>
    axiosInstance.get<T.ClubEventsListResponse>(
      `clubs/${clubId}/events/list/${index}`,
    ),
  // The apidoc names the field `events` for a single event.
  event: (clubId: string, eventId: string) =>
    axiosInstance.get<{ event?: T.ClubEvent; events?: T.ClubEvent }>(
      `clubs/${clubId}/events/one/${eventId}`,
    ),
  createEvent: (clubId: string, params: T.CreateClubEventRequest) =>
    axiosInstance.post<T.ClubEventResponse>(
      `clubs/${clubId}/events/create`,
      params,
    ),
  setEventLocation: (
    clubId: string,
    eventId: string,
    params: T.SetEventLocationRequest,
  ) =>
    axiosInstance.post<T.ClubEventResponse>(
      `clubs/${clubId}/events/${eventId}/locations/0`,
      params,
    ),
  joinEvent: (clubId: string, eventId: string) =>
    axiosInstance.get<void>(`clubs/${clubId}/events/${eventId}/join`),
  leaveEvent: (clubId: string, eventId: string) =>
    axiosInstance.get<void>(`clubs/${clubId}/events/${eventId}/leave`),
} as const;
