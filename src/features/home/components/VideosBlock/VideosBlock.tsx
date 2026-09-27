import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import {
  Carousel,
  ImageCard,
  LoadingMore,
  SectionTitle,
} from '@/ui/components';

import { useLatestVideosQuery } from '@/hooks';

import { youtubeThumbnail } from '@/utils';

import type { VideosBlockProps } from './types';

/**
 * Home-screen "Latest videos": match review videos as swipeable cards with a
 * play button. Hidden when no played match has a video.
 */
export function VideosBlock({ onOpenVideo, style }: VideosBlockProps) {
  const { t } = useTranslation();
  const { data: matches, isPending } = useLatestVideosQuery();

  if (isPending) return <LoadingMore loading />;
  if (!matches?.length) return null;

  return (
    <View style={style}>
      <SectionTitle title={t('home.videosTitle')} />
      <Carousel
        data={matches}
        itemWidthRatio={0.9}
        keyExtractor={(match) => String(match._id)}
        renderItem={(match) => (
          <ImageCard
            variant="article"
            image={youtubeThumbnail(match.videoLink!)}
            overlayIcon="play"
            title={t('home.videoTitle', {
              league: match.league.name,
              home: match.homeTeam.name,
              away: match.awayTeam.name,
              homeGoals: match.goalsHomeTeam ?? 0,
              awayGoals: match.goalsAwayTeam ?? 0,
            })}
            onPress={() => onOpenVideo(match.videoLink!)}
          />
        )}
      />
    </View>
  );
}

VideosBlock.displayName = 'VideosBlock';
