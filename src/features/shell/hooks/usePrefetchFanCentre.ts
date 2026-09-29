import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Image, InteractionManager } from 'react-native';

import {
  actualFixturesQueryOptions,
  backendSquadQueryOptions,
  clubEventsQueryOptions,
  clubsQueryOptions,
  fixturesTableQueryOptions,
  lineupPredictionQueryOptions,
  MATCH_STARTED_STATUSES,
  matchdayEventsQueryOptions,
  matchOddsQueryOptions,
  myClubsQueryOptions,
  predictionQueryOptions,
  quizQueryOptions,
  squadQueryOptions,
  votesQueryOptions,
} from '@/hooks';

import { playerPhoto } from '@/utils';

/** Longest wait for the first screen's own requests before preloading. */
const IDLE_WAIT_MS = 6000;
const IDLE_POLL_MS = 300;

/**
 * Loads the Fan-centre tab's data (and the players-of-the-match photos) in
 * the background once the first screen has settled, so the tab opens
 * filled. Failures are ignored: the tab fetches again when opened.
 */
export function usePrefetchFanCentre() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;

    const waitForIdle = async () => {
      const started = Date.now();
      while (
        !cancelled &&
        queryClient.isFetching() > 0 &&
        Date.now() - started < IDLE_WAIT_MS
      ) {
        await new Promise((resolve) => setTimeout(resolve, IDLE_POLL_MS));
      }
    };

    const prefetch = async () => {
      await waitForIdle();
      if (cancelled) return;

      const fixtures = await queryClient
        .fetchQuery(actualFixturesQueryOptions())
        .catch(() => null);
      const next = fixtures?.fixtures.find(
        (f) => !MATCH_STARTED_STATUSES.has(f.status),
      );

      await Promise.allSettled([
        queryClient.prefetchQuery(matchdayEventsQueryOptions()),
        queryClient.prefetchQuery(clubsQueryOptions()),
        queryClient.prefetchQuery(myClubsQueryOptions()),
        queryClient.prefetchQuery(clubEventsQueryOptions()),
        queryClient.prefetchQuery(fixturesTableQueryOptions()),
        queryClient.prefetchQuery(quizQueryOptions()),
        queryClient.prefetchQuery(backendSquadQueryOptions()),
        ...(next
          ? [
              queryClient.prefetchQuery(lineupPredictionQueryOptions(next._id)),
              queryClient.prefetchQuery(predictionQueryOptions(next._id)),
              queryClient.prefetchQuery(matchOddsQueryOptions(next._id)),
            ]
          : []),
      ]);
      if (cancelled) return;

      // The players-of-the-match photos are the page's heaviest images.
      const [votes, squad] = await Promise.all([
        queryClient.fetchQuery(votesQueryOptions()).catch(() => null),
        queryClient.fetchQuery(squadQueryOptions()).catch(() => null),
      ]);
      if (cancelled || !votes) return;
      for (const vote of votes.votes) {
        const { image } = playerPhoto(vote.player, squad?.squad.players);
        if (image) void Image.prefetch(image).catch(() => false);
      }
    };

    const task = InteractionManager.runAfterInteractions(() => {
      void prefetch();
    });
    return () => {
      cancelled = true;
      task.cancel();
    };
  }, [queryClient]);
}
