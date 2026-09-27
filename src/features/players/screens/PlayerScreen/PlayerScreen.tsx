import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Share, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  Button,
  EmptyState,
  InfoRow,
  LoadingMore,
  PageLayout,
  SectionTitle,
  Text,
} from '@/ui/components';

import { usePlayerDetailsQuery, usePlayerQuery } from '@/hooks';

import { goBack } from '@/utils';

import type { StatTileProps } from './types';

const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];

/**
 * A player's page: photo with the shirt number, name and position, bio rows,
 * statistics and a "buy the shirt" button.
 */
export function PlayerScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: player, isPending } = usePlayerQuery(id);
  const { data: details } = usePlayerDetailsQuery(id);
  const name = player ? (player.actualName ?? player.name) : '';

  const stats = details
    ? ([
        ['matches', details.matches],
        ['goals', details.goals],
        ['assists', details.assists],
      ] as const)
    : [];

  return (
    <PageLayout
      title={name}
      onBack={goBack}
      onShare={
        player?.ruhLink
          ? () => void Share.share({ message: player.ruhLink! })
          : undefined
      }
      contentStyle={styles.content}
    >
      {isPending ? (
        <LoadingMore loading />
      ) : !player ? (
        <EmptyState
          icon="user"
          title={t('lineup.emptyTitle')}
          text={t('player.notFound')}
        />
      ) : (
        <>
          <View style={styles.photoCard}>
            <Image
              source={{ uri: player.actualPhoto ?? player.photo }}
              resizeMode="contain"
              accessibilityLabel={name}
              style={styles.photo}
            />
            <Text
              variant="displaySemibold"
              color="brandBorder"
              style={styles.number}
            >
              {player.number}
            </Text>
          </View>
          <View>
            <Text variant="h4Medium" accessibilityRole="header">
              {name}
            </Text>
            <Text variant="bodyMRegular" color="mutedForeground">
              {POSITIONS.includes(player.position)
                ? t(
                    `player.position.${player.position}` as 'player.position.Goalkeeper',
                  )
                : player.position}
            </Text>
          </View>
          {details ? (
            <>
              <View style={styles.rows}>
                <InfoRow
                  label={t('player.birthday')}
                  value={new Intl.DateTimeFormat(i18n.language).format(
                    new Date(details.birthday),
                  )}
                />
                <InfoRow
                  label={t('player.nationality')}
                  value={details.nationality}
                />
                <InfoRow
                  label={t('player.height')}
                  value={t('player.cm', { value: details.height })}
                />
                <InfoRow
                  label={t('player.weight')}
                  value={t('player.kg', { value: details.weight })}
                />
              </View>
              <SectionTitle title={t('player.stats')} style={styles.flush} />
              <View style={styles.tiles}>
                {stats.map(([key, stat]) => (
                  <StatTile
                    key={key}
                    value={stat.total}
                    label={t(`player.${key}`)}
                    caption={t('player.seasonStat', {
                      season: details.season,
                      value: stat.season,
                    })}
                  />
                ))}
              </View>
            </>
          ) : null}
          <Button
            size="xs"
            fullWidth
            backgroundColor="brand"
            textColor="onBrand"
            text={t('player.buyShirt')}
            onPress={() => router.navigate('/shop')}
          />
        </>
      )}
    </PageLayout>
  );
}

function StatTile({ value, label, caption }: StatTileProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}, ${caption}`}
      style={styles.tile}
    >
      <View style={styles.tileTop}>
        <Text variant="h1Semibold" color="brand">
          {value}
        </Text>
        <Text variant="bodySRegular">{label}</Text>
      </View>
      <Text variant="bodyXSMedium" style={styles.tileCaption}>
        {caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing(4),
    paddingHorizontal: theme.spacing(4),
  },
  photoCard: {
    height: 300,
    overflow: 'hidden',
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.brandStrong,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  number: {
    position: 'absolute',
    left: theme.spacing(4),
    bottom: theme.spacing(2),
  },
  rows: {
    gap: theme.spacing(1),
  },
  flush: {
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  tiles: {
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  tile: {
    flex: 1,
    gap: theme.spacing(1),
  },
  tileTop: {
    alignItems: 'center',
    paddingVertical: theme.spacing(3),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.secondary,
  },
  tileCaption: {
    textAlign: 'center',
    paddingVertical: theme.spacing(1),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.secondary,
  },
}));
