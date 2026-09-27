import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Share, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  BlockHeader,
  Button,
  GoalsPicker,
  LoadingMore,
  Text,
} from '@/ui/components';

import { useActualFixturesQuery, useMakePredictionMutation } from '@/hooks';

import type { PredictionBlockProps, TeamLogoProps } from './types';

/**
 * Score prediction for the next match: pick home and away goals, send.
 * Locks once sent (then offers Share). Hidden when no match is upcoming.
 */
export function PredictionBlock({ style }: PredictionBlockProps) {
  const { t } = useTranslation();
  const { data, isPending } = useActualFixturesQuery();
  const makePrediction = useMakePredictionMutation();
  const [home, setHome] = useState<number | null>(null);
  const [away, setAway] = useState<number | null>(null);

  if (isPending) return <LoadingMore loading />;
  const match = data?.next;
  if (!match) return null;

  const sent = makePrediction.isSuccess;
  const ourTeamIsHome = match.homeTeam.id === match._teamId;

  const send = () => {
    if (home === null || away === null) return;
    makePrediction.mutate({
      fixture: match._id,
      friend: ourTeamIsHome ? home : away,
      enemy: ourTeamIsHome ? away : home,
    });
  };

  const share = () =>
    void Share.share({
      message: t('prediction.shareMessage', {
        home: match.homeTeam.name,
        away: match.awayTeam.name,
        homeGoals: home,
        awayGoals: away,
      }),
    });

  return (
    <View style={[styles.container, style]}>
      <BlockHeader title={t('prediction.title')} />
      <View style={styles.row}>
        <TeamLogo uri={match.homeTeam.logo} name={match.homeTeam.name} />
        <View style={styles.center}>
          <Image
            source={{ uri: match.league.logo }}
            resizeMode="contain"
            style={styles.leagueLogo}
          />
          <View style={styles.score}>
            <GoalsPicker
              value={home}
              onChange={setHome}
              buttonsSide="left"
              readOnly={sent}
              accessibilityLabel={t('prediction.homeGoals', {
                team: match.homeTeam.name,
              })}
            />
            <Text variant="h1Semibold">:</Text>
            <GoalsPicker
              value={away}
              onChange={setAway}
              readOnly={sent}
              accessibilityLabel={t('prediction.awayGoals', {
                team: match.awayTeam.name,
              })}
            />
          </View>
        </View>
        <TeamLogo uri={match.awayTeam.logo} name={match.awayTeam.name} />
      </View>
      {sent ? (
        <Button size="sm" text={t('prediction.share')} onPress={share} />
      ) : (
        <Button
          size="sm"
          text={t('prediction.send')}
          disabled={home === null || away === null}
          loading={makePrediction.isPending}
          onPress={send}
        />
      )}
    </View>
  );
}

PredictionBlock.displayName = 'PredictionBlock';

function TeamLogo({ uri, name }: TeamLogoProps) {
  return (
    <View style={styles.team}>
      <Image
        source={{ uri }}
        resizeMode="contain"
        accessibilityLabel={name}
        style={styles.teamLogo}
      />
      <Text variant="bodySSemibold" numberOfLines={2} style={styles.teamName}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    paddingBottom: theme.spacing(4),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(3),
  },
  team: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  teamLogo: {
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
  teamName: {
    textAlign: 'center',
  },
  center: {
    alignItems: 'center',
  },
  leagueLogo: {
    width: 55,
    height: 55,
  },
  score: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));
