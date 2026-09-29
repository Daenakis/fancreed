import { queryOptions, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { localizeEvent } from '@/utils';

import { eventsApi, fetcher } from '@/api';

import { QueryKey } from '@/types';
import type { EventsListResponse } from '@/types/api';

export const matchdayEventsQueryOptions = () =>
  queryOptions({
    queryKey: [QueryKey.Events, 'matchday', 0],
    queryFn: () => fetcher(eventsApi.matchdayList(0)),
    select: (response) => response.events,
  });

/** Matchday events, their texts in the app language. */
export function useMatchdayEventsQuery() {
  const { i18n } = useTranslation();
  const language = i18n.language;
  return useQuery({
    ...matchdayEventsQueryOptions(),
    select: useCallback(
      (response: EventsListResponse) =>
        response.events.map((event) => localizeEvent(event, language)),
      [language],
    ),
  });
}
