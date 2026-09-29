import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  Button,
  Carousel,
  ImageCard,
  RemoteImage,
  Text,
} from '@/ui/components';

import {
  useFixturesTableQuery,
  useMakeVoteMutation,
  useMatchOddsQuery,
  useSponsorsQuery,
  useSquadQuery,
  useVotesQuery,
} from '@/hooks';

import { playerPhoto } from '@/utils';

import type { VotesBlockProps } from './types';

/**
 * "Players of the match" (Figma): sponsor and both crests in the title,
 * players to swipe through and Vote. Once the fan has voted — or voting is
 * over — everyone's share shows, the fan's pick is marked and the button
 * turns into Share. Hidden when there's nothing to vote on.
 */
export function VotesBlock({ style }: VotesBlockProps) {
  const { t } = useTranslation();
  const { data, isPending } = useVotesQuery();
  // The club site's cut-out photos, nicer than api-football's headshots.
  const { data: squad } = useSquadQuery();
  const makeVote = useMakeVoteMutation();
  const { data: fixtures } = useFixturesTableQuery();
  const votes = data?.votes ?? [];
  const fixtureId = votes[0]?.fixture;
  const { data: odds } = useMatchOddsQuery(fixtureId);
  const { data: sponsors } = useSponsorsQuery();
  const [index, setIndex] = useState(0);

  // No placeholder: most of the time there's no vote, and a skeleton that
  // vanishes would jump the page more than a block that appears.
  if (isPending || !votes.length) return null;

  const open = !votes[0]!.finished;
  const showResults = data!.youVoted || !open;
  const match = [...(fixtures?.past ?? []), ...(fixtures?.future ?? [])].find(
    (m) => m._id === fixtureId,
  );
  const sponsor = sponsors?.find(
    (s) => s.name.toLowerCase() === odds?.sponsor.toLowerCase(),
  );

  const share = () =>
    void Share.share({
      message: t('votes.shareMessage', {
        home: match?.homeTeam.name ?? '',
        away: match?.awayTeam.name ?? '',
      }),
    });

  return (
    <View style={style}>
      <View style={styles.header}>
        <Text variant="h3Medium" accessibilityRole="header">
          {t('votes.playerOfMatch')}
        </Text>
        {sponsor ? (
          <RemoteImage
            source={{ uri: sponsor.image }}
            resizeMode="contain"
            accessibilityLabel={sponsor.name}
            style={styles.sponsor}
          />
        ) : null}
        {match ? (
          <>
            <RemoteImage
              source={{ uri: match.homeTeam.logo }}
              accessibilityLabel={match.homeTeam.name}
              style={styles.crest}
            />
            <RemoteImage
              source={{ uri: match.awayTeam.logo }}
              accessibilityLabel={match.awayTeam.name}
              style={styles.crest}
            />
          </>
        ) : null}
      </View>
      <Carousel
        data={votes}
        itemWidthRatio={0.35}
        keyExtractor={(vote) => vote._id}
        onIndexChange={setIndex}
        showIndicator={false}
        style={styles.carousel}
        renderItem={(vote, i) => {
          const mine = data!.yourVote?._id === vote._id;
          const photo = playerPhoto(vote.player, squad);
          return (
            <ImageCard
              image={photo.image}
              fallbackImage={photo.fallback}
              placeholderIcon="lion"
              title={vote.player.actualName ?? vote.player.name}
              subtitle={
                showResults
                  ? mine
                    ? `${vote.percent}% · ${t('votes.yourVote')}`
                    : `${vote.percent}%`
                  : undefined
              }
              textColor={i === index ? 'foreground' : 'mutedForeground'}
              style={styles.card}
            />
          );
        }}
      />
      <View style={styles.inset}>
        {showResults ? (
          <Button
            size="xs"
            fullWidth
            backgroundColor="brand"
            textColor="onBrand"
            text={t('votes.share')}
            onPress={share}
          />
        ) : (
          <Button
            size="xs"
            fullWidth
            backgroundColor="brand"
            textColor="onBrand"
            text={t('votes.choose')}
            loading={makeVote.isPending}
            onPress={() => makeVote.mutate({ id: votes[index]!._id })}
          />
        )}
      </View>
    </View>
  );
}

VotesBlock.displayName = 'VotesBlock';

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(5),
    marginBottom: theme.spacing(3),
  },
  sponsor: {
    width: 80,
    height: theme.spacing(5),
  },
  crest: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    resizeMode: 'contain',
  },
  carousel: {
    marginBottom: theme.spacing(4),
  },
  card: {
    width: '100%',
  },
  inset: {
    marginHorizontal: theme.spacing(5),
  },
}));
