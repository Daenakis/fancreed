import { Carousel, LoadingMore } from '@/ui/components';

import { useActualFixturesQuery } from '@/hooks';

import { initialMatchIndex } from '@/utils';

import { MatchCard } from '@/features/matches';

import type { MatchesBlockProps } from './types';

/**
 * Home-screen matches: last played and upcoming matches as swipeable cards,
 * opening on the next match once the last one is over a day old.
 */
export function MatchesBlock({ onOpenLink, style }: MatchesBlockProps) {
  const { data: fixtures, isPending } = useActualFixturesQuery();

  if (isPending) return <LoadingMore loading />;
  if (!fixtures?.length) return null;

  return (
    <Carousel
      data={fixtures}
      initialIndex={initialMatchIndex(fixtures)}
      itemWidthRatio={0.9}
      keyExtractor={(match) => String(match._id)}
      renderItem={(match) => (
        <MatchCard match={match} onOpenLink={onOpenLink} />
      )}
      style={style}
    />
  );
}

MatchesBlock.displayName = 'MatchesBlock';
