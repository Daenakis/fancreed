import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Linking, Share } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  EmptyState,
  ImageCard,
  LoadingMore,
  PageLayout,
} from '@/ui/components';

import { useMatchVideosQuery } from '@/hooks';

import { goBack, youtubeThumbnail } from '@/utils';

// TODO: open in an in-app browser once one is approved (expo-web-browser).
const openVideo = (url: string) => void Linking.openURL(url);

/** Match review videos, newest first; `?match=<id>` puts that match on top. */
export function VideosScreen() {
  const { t } = useTranslation();
  const { match: matchId } = useLocalSearchParams<{ match?: string }>();
  const { data: matches, isPending } = useMatchVideosQuery();
  const ordered = [...(matches ?? [])].sort(
    (a, b) =>
      Number(String(b._id) === matchId) - Number(String(a._id) === matchId),
  );
  const first = ordered[0];

  return (
    <PageLayout
      title={t('videos.title')}
      onBack={goBack}
      onShare={
        first?.videoLink
          ? () => void Share.share({ message: first.videoLink! })
          : undefined
      }
      contentStyle={styles.content}
    >
      {isPending ? (
        <LoadingMore loading />
      ) : ordered.length ? (
        ordered.map((match) => (
          <ImageCard
            key={match._id}
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
            onPress={() => openVideo(match.videoLink!)}
          />
        ))
      ) : (
        <EmptyState
          icon="video"
          title={t('lineup.emptyTitle')}
          text={t('videos.emptyText')}
        />
      )}
    </PageLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing(4),
    paddingHorizontal: theme.spacing(4),
  },
}));
