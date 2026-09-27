import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import { useNow } from '@/hooks';

import { countdownTo, matchPhase, roundNumber } from '@/utils';

import type { MatchCardProps, MatchLinkProps } from './types';

/**
 * One match: league, date and round on top; team logos around the score
 * (or a countdown before kick-off); links to tickets / review / video.
 */
export function MatchCard({ match, onOpenLink, style }: MatchCardProps) {
  const { t, i18n } = useTranslation();
  const now = useNow();
  const phase = matchPhase(match.status);
  const countdown = countdownTo(match.event_date, now);
  const hasTimeLeft = countdown.days + countdown.hours + countdown.minutes > 0;
  const elapsed = match.fixture?.status.elapsed;
  const date = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(match.event_date));

  return (
    <View style={[styles.card, style]}>
      <View style={styles.top}>
        <Text variant="bodySSemibold" numberOfLines={2} style={styles.side}>
          {match.league.name}
        </Text>
        <Text variant="bodyLMedium" style={styles.date}>
          {date}
        </Text>
        <Text variant="bodySSemibold" style={styles.side}>
          {t('match.round', { round: roundNumber(match.round) })}
        </Text>
      </View>
      <View style={styles.middle}>
        <Image
          source={{ uri: match.homeTeam.logo }}
          resizeMode="contain"
          accessibilityLabel={match.homeTeam.name}
          style={styles.teamLogo}
        />
        <View style={styles.center}>
          <Image
            source={{ uri: match.league.logo }}
            resizeMode="contain"
            style={styles.leagueLogo}
          />
          <Text variant="bodySSemibold" style={styles.centered}>
            {t(`match.status.${phase}`)}
          </Text>
          <View style={styles.separator} />
          {phase === 'live' || phase === 'finished' ? (
            <Text
              variant="h2Medium"
              accessibilityLabel={t('match.score', {
                home: match.homeTeam.name,
                away: match.awayTeam.name,
                homeGoals: match.goalsHomeTeam ?? 0,
                awayGoals: match.goalsAwayTeam ?? 0,
              })}
              style={styles.centered}
            >
              {match.goalsHomeTeam ?? 0} : {match.goalsAwayTeam ?? 0}
            </Text>
          ) : null}
          {phase === 'live' && elapsed ? (
            <Text variant="h4Semibold" color="destructive">
              {elapsed}&apos;
            </Text>
          ) : null}
          {/* No countdown once kick-off time has passed (stale "Not Started"). */}
          {phase === 'upcoming' && hasTimeLeft ? (
            <Text variant="bodyMSemibold" style={styles.centered}>
              {countdown.days > 0
                ? `${t('match.days', { count: countdown.days })}\n`
                : ''}
              {t('match.hours', { count: countdown.hours })}{' '}
              {t('match.minutes', { count: countdown.minutes })}
            </Text>
          ) : null}
        </View>
        <Image
          source={{ uri: match.awayTeam.logo }}
          resizeMode="contain"
          accessibilityLabel={match.awayTeam.name}
          style={styles.teamLogo}
        />
      </View>
      <View style={styles.links}>
        {phase === 'upcoming' ? (
          <MatchLink
            label={t('match.tickets')}
            url={match.ticketLink}
            onOpenLink={onOpenLink}
          />
        ) : (
          <>
            <MatchLink
              label={t('match.review')}
              url={match.overviewLink}
              onOpenLink={onOpenLink}
            />
            <MatchLink
              label={t('match.video')}
              url={match.videoLink}
              onOpenLink={onOpenLink}
            />
          </>
        )}
      </View>
    </View>
  );
}

MatchCard.displayName = 'MatchCard';

/** A link under the card; hidden when the match has no URL for it. */
function MatchLink({ label, url, onOpenLink }: MatchLinkProps) {
  if (!url) return null;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={() => onOpenLink(url)}
    >
      <Text variant="h4Semibold">{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.secondary,
    paddingVertical: theme.spacing(3),
    paddingHorizontal: theme.spacing(2),
    gap: theme.spacing(2),
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    flex: 1,
    textAlign: 'center',
  },
  date: {
    flex: 2,
    textAlign: 'center',
  },
  middle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamLogo: {
    width: theme.spacing(18),
    height: theme.spacing(18),
  },
  center: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  leagueLogo: {
    width: 55,
    height: 55,
  },
  separator: {
    alignSelf: 'stretch',
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.foreground,
  },
  centered: {
    textAlign: 'center',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    minHeight: theme.spacing(6),
  },
}));
