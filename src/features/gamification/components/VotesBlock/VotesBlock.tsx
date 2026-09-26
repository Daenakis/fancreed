import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  BlockHeader,
  Button,
  Carousel,
  ImageCard,
  LoadingMore,
} from '@/ui/components';

import { useMakeVoteMutation, useVotesQuery } from '@/hooks';

import type { VotesBlockProps } from './types';

/**
 * "Player of the match": swipe to a player and press Choose. Once the fan
 * has voted — or voting is over — everyone's share is shown and the button
 * turns into Share. Hidden when there's nothing to vote on.
 */
export function VotesBlock({ homeTeam, awayTeam, style }: VotesBlockProps) {
  const { t } = useTranslation();
  const { data, isPending } = useVotesQuery();
  const makeVote = useMakeVoteMutation();
  const [index, setIndex] = useState(0);

  if (isPending) return <LoadingMore loading />;
  const votes = data?.votes ?? [];
  if (!votes.length) return null;

  const open = !votes[0]!.finished;
  const showResults = data!.youVoted || !open;

  const share = () =>
    void Share.share({
      message: t('votes.shareMessage', {
        home: homeTeam ?? '',
        away: awayTeam ?? '',
      }),
    });

  return (
    <View style={[styles.container, style]}>
      <BlockHeader title={t('votes.playerOfMatch')} />
      <Carousel
        data={votes}
        itemWidthRatio={0.35}
        keyExtractor={(vote) => vote._id}
        onIndexChange={setIndex}
        style={styles.carousel}
        renderItem={(vote) => (
          <ImageCard
            image={vote.player.actualPhoto ?? vote.player.photo}
            title={vote.player.actualName ?? vote.player.name}
            subtitle={showResults ? `${vote.percent}%` : undefined}
            style={styles.card}
          />
        )}
      />
      {showResults ? (
        <Button size="sm" text={t('votes.share')} onPress={share} />
      ) : (
        <Button
          size="sm"
          text={t('votes.choose')}
          loading={makeVote.isPending}
          onPress={() => makeVote.mutate({ id: votes[index]!._id })}
        />
      )}
    </View>
  );
}

VotesBlock.displayName = 'VotesBlock';

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    paddingBottom: theme.spacing(4),
  },
  carousel: {
    alignSelf: 'stretch',
    marginVertical: theme.spacing(3),
  },
  card: {
    width: '100%',
  },
}));
