import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Share, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  Button,
  GoalsPicker,
  LoadingMore,
  SectionTitle,
  Text,
} from '@/ui/components';

import {
  useMakePredictionMutation,
  useMatchOddsQuery,
  useNextMatchQuery,
  useSponsorsQuery,
} from '@/hooks';

import type { PredictionBlockProps, TeamLogoProps } from './types';

/**
 * "Match prediction" for the next match on a green card: pick home and away
 * goals, vote. Once sent the score locks, the sponsor's odds show and the
 * button turns into Share. Hidden when no match is upcoming.
 */
export function PredictionBlock({ style }: PredictionBlockProps) {
  const { t } = useTranslation();
  const { data, isPending } = useNextMatchQuery();
  const match = data?.next;
  const { data: odds } = useMatchOddsQuery(match?._id);
  const { data: sponsors } = useSponsorsQuery();
  const makePrediction = useMakePredictionMutation();
  const [home, setHome] = useState<number | null>(null);
  const [away, setAway] = useState<number | null>(null);

  if (isPending) return <LoadingMore loading />;
  if (!match) return null;

  const sent = makePrediction.isSuccess;
  const ourTeamIsHome = match.homeTeam.id === match._teamId;
  const sponsor = sponsors?.find(
    (s) => s.name.toLowerCase() === odds?.sponsor.toLowerCase(),
  );

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
    <View style={style}>
      <SectionTitle title={t('prediction.title')} />
      <View style={styles.card}>
        {sponsor ? (
          <Image
            source={{ uri: sponsor.image }}
            resizeMode="contain"
            accessibilityLabel={sponsor.name}
            style={styles.sponsor}
          />
        ) : null}
        {sent && odds ? (
          <View style={styles.odds}>
            {odds.odds.map((odd) => (
              <View key={odd.label} style={styles.odd}>
                <Text variant="bodySRegular" color="brandMutedForeground">
                  {odd.label}
                </Text>
                <Text variant="bodySSemibold" color="onBrand">
                  {odd.value}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
        <View style={styles.row}>
          <TeamLogo uri={match.homeTeam.logo} name={match.homeTeam.name} />
          <View style={styles.score}>
            <GoalsPicker
              value={home}
              onChange={setHome}
              color="onBrand"
              readOnly={sent}
              accessibilityLabel={t('prediction.homeGoals', {
                team: match.homeTeam.name,
              })}
            />
            <Text variant="h1Semibold" color="onBrand">
              :
            </Text>
            <GoalsPicker
              value={away}
              onChange={setAway}
              color="onBrand"
              readOnly={sent}
              accessibilityLabel={t('prediction.awayGoals', {
                team: match.awayTeam.name,
              })}
            />
          </View>
          <TeamLogo uri={match.awayTeam.logo} name={match.awayTeam.name} />
        </View>
        {sent ? (
          <Button
            variant="brand"
            fullWidth
            text={t('prediction.share')}
            onPress={share}
          />
        ) : (
          <Button
            variant="brand"
            fullWidth
            text={t('prediction.send')}
            disabled={home === null || away === null}
            loading={makePrediction.isPending}
            onPress={send}
          />
        )}
      </View>
    </View>
  );
}

PredictionBlock.displayName = 'PredictionBlock';

function TeamLogo({ uri, name }: TeamLogoProps) {
  return (
    <Image
      source={{ uri }}
      resizeMode="contain"
      accessibilityLabel={name}
      style={styles.teamLogo}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    marginHorizontal: theme.spacing(5),
    padding: theme.spacing(4),
    gap: theme.spacing(4),
    alignItems: 'center',
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.brand,
  },
  sponsor: {
    width: 140,
    height: theme.spacing(8),
  },
  odds: {
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  odd: {
    flexDirection: 'row',
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(1),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.brandSurface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  teamLogo: {
    width: theme.spacing(14),
    height: theme.spacing(14),
  },
  score: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));
