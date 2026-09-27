import { useTranslation } from 'react-i18next';
import { Image, Pressable, Share, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Button, Icon, Text } from '@/ui/components';

import { useNow } from '@/hooks';

import { countdownTo, matchPhase, roundNumber } from '@/utils';

import type {
  ChipProps,
  MatchCardProps,
  MatchLinkItem,
  MatchVariantProps,
} from './types';

/**
 * One match. `full`: green home-screen card — league and round on top, team
 * crests around the kick-off time (or the score), a countdown before
 * kick-off and a row of links (disabled when the match has nothing to open).
 * `compact`: light-green calendar card — league and share on top, crests
 * around the date/time (or score), then Events, Video and Tickets buttons.
 */
export function MatchCard({ variant = 'full', ...props }: MatchCardProps) {
  return variant === 'compact' ? (
    <CompactMatch {...props} />
  ) : (
    <FullMatch {...props} />
  );
}

MatchCard.displayName = 'MatchCard';

function FullMatch({
  match,
  onOpenLink,
  onOpenLineup,
  onOpenVideos,
  style,
}: MatchVariantProps) {
  const { t, i18n } = useTranslation();
  const now = useNow();
  const phase = matchPhase(match.status);
  const played = phase === 'live' || phase === 'finished';
  const countdown = countdownTo(match.event_date, now);
  const hasTimeLeft = countdown.days + countdown.hours + countdown.minutes > 0;
  const elapsed = match.fixture?.status.elapsed;
  const kickOff = new Date(match.event_date);
  const day = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'long',
  }).format(kickOff);
  const time = new Intl.DateTimeFormat(i18n.language, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(kickOff);
  // TODO(backend): no women's flag on fixtures yet — guessed from the league name.
  const women = /women|жін/i.test(match.league.name);
  const link = (url?: string | null) =>
    url ? () => onOpenLink(url) : undefined;
  const lineup = onOpenLineup ? () => onOpenLineup(match) : undefined;
  const video =
    match.videoLink && onOpenVideos
      ? () => onOpenVideos(match)
      : link(match.videoLink);
  const links: MatchLinkItem[] = played
    ? [
        { label: t('match.review'), onPress: link(match.overviewLink) },
        { label: t('match.lineup'), onPress: lineup },
        { label: t('match.photo'), onPress: link(match.photoLink) },
        { label: t('match.video'), onPress: video },
      ]
    : [
        { label: t('match.lineup'), onPress: lineup },
        { label: t('match.preview'), onPress: link(match.previewLink) },
        { label: t('match.video'), onPress: video },
        {
          label: t('match.tickets'),
          onPress: link(match.ticketLink),
          primary: true,
        },
      ];

  return (
    <View style={[styles.card, style]}>
      {women ? (
        <View style={styles.badge}>
          <Text variant="bodySSemibold" color="onHighlight">
            {t('match.women')}
          </Text>
        </View>
      ) : null}
      <View style={styles.top}>
        <Image
          source={{ uri: match.league.logo }}
          resizeMode="contain"
          style={styles.leagueLogo}
        />
        <Text
          variant="bodySRegular"
          color="onBrand"
          numberOfLines={1}
          style={styles.league}
        >
          {match.league.name} |{' '}
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
          <Text variant="bodyMRegular" color="onBrand" style={styles.centered}>
            {played
              ? t(phase === 'live' ? 'match.live' : 'match.finished')
              : day}
          </Text>
          {played ? (
            <Text
              variant="h1Semibold"
              color="onBrand"
              accessibilityLabel={t('match.score', {
                home: match.homeTeam.name,
                away: match.awayTeam.name,
                homeGoals: match.goalsHomeTeam ?? 0,
                awayGoals: match.goalsAwayTeam ?? 0,
              })}
            >
              {match.goalsHomeTeam ?? 0} - {match.goalsAwayTeam ?? 0}
            </Text>
          ) : (
            <Text variant="h1Semibold" color="onBrand">
              {time}
            </Text>
          )}
          {phase === 'live' && elapsed ? (
            <Text variant="bodyMSemibold" color="onBrand">
              {elapsed}&apos;
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
      {/* No countdown once kick-off time has passed (stale "Not Started"). */}
      {phase === 'upcoming' && hasTimeLeft ? (
        <View style={styles.countdown}>
          <Text variant="bodySRegular" color="onBrand">
            {t('match.timeLeft')}
          </Text>
          <View style={styles.chips}>
            {countdown.days > 0 ? (
              <Chip text={t('match.days', { count: countdown.days })} />
            ) : null}
            <Chip text={t('match.hours', { count: countdown.hours })} />
            <Chip text={t('match.minutes', { count: countdown.minutes })} />
          </View>
        </View>
      ) : null}
      <View style={styles.links}>
        {links.map(({ label, onPress, primary }) => (
          <Button
            key={label}
            variant={primary ? 'brand' : 'brandOutline'}
            size="xs"
            text={label}
            disabled={!onPress}
            onPress={onPress}
            style={styles.link}
          />
        ))}
      </View>
    </View>
  );
}

function Chip({ text }: ChipProps) {
  return (
    <View style={styles.chip}>
      <Text variant="bodySSemibold" color="onBrand">
        {text}
      </Text>
    </View>
  );
}

function CompactMatch({
  match,
  onOpenLink,
  onOpenEvents,
  onOpenVideos,
  title,
  actions = true,
  style,
}: MatchVariantProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useUnistyles();
  const phase = matchPhase(match.status);
  const played = phase === 'live' || phase === 'finished';
  const kickOff = new Date(match.event_date);
  const day = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'long',
  }).format(kickOff);
  const time = new Intl.DateTimeFormat(i18n.language, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(kickOff);
  const video =
    match.videoLink && onOpenVideos
      ? () => onOpenVideos(match)
      : match.videoLink
        ? () => onOpenLink(match.videoLink!)
        : undefined;

  const share = () =>
    void Share.share({
      message: t('match.shareMessage', {
        home: match.homeTeam.name,
        away: match.awayTeam.name,
        date: `${day} ${time}`,
      }),
    });

  return (
    <View style={[styles.row, style]}>
      <View style={styles.rowHead}>
        <Text
          variant={actions ? 'bodyMRegular' : 'bodyLRegular'}
          numberOfLines={2}
          style={styles.rowLeague}
        >
          {title ?? match.league.name}
        </Text>
        {actions ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('match.share')}
            hitSlop={8}
            onPress={share}
          >
            <Icon name="telegram" size={18} color={theme.colors.foreground} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.rowTeams}>
        <Image
          source={{ uri: match.homeTeam.logo }}
          resizeMode="contain"
          accessibilityLabel={match.homeTeam.name}
          style={styles.rowLogo}
        />
        {played ? (
          <View style={styles.center}>
            {actions ? null : (
              <Text variant="bodySRegular">
                {t(phase === 'live' ? 'match.live' : 'match.finished')}
              </Text>
            )}
            <Text
              variant="h1Semibold"
              accessibilityLabel={t('match.score', {
                home: match.homeTeam.name,
                away: match.awayTeam.name,
                homeGoals: match.goalsHomeTeam ?? 0,
                awayGoals: match.goalsAwayTeam ?? 0,
              })}
            >
              {match.goalsHomeTeam ?? 0} - {match.goalsAwayTeam ?? 0}
            </Text>
          </View>
        ) : (
          <View style={styles.center}>
            <Text variant="bodyMRegular">{day}</Text>
            <Text variant="h2Medium">{time}</Text>
          </View>
        )}
        <Image
          source={{ uri: match.awayTeam.logo }}
          resizeMode="contain"
          accessibilityLabel={match.awayTeam.name}
          style={styles.rowLogo}
        />
      </View>
      {actions ? (
        <View style={styles.rowActions}>
          <Button
            variant="brandLine"
            size="xs"
            text={t('match.events')}
            disabled={!onOpenEvents}
            onPress={() => onOpenEvents?.(match)}
            style={styles.link}
          />
          <Button
            variant="brandLine"
            size="xs"
            text={t('match.video')}
            disabled={!video}
            onPress={video}
            style={styles.link}
          />
          {played ? null : (
            <Button
              size="xs"
              backgroundColor="brand"
              textColor="onBrand"
              text={t('match.tickets')}
              disabled={!match.ticketLink}
              onPress={() => onOpenLink(match.ticketLink!)}
              style={styles.link}
            />
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.brand,
    padding: theme.spacing(4),
    gap: theme.spacing(4),
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  leagueLogo: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  league: {
    flexShrink: 1,
  },
  // Hangs from the card's top edge.
  badge: {
    alignSelf: 'center',
    marginTop: -theme.spacing(4),
    marginBottom: -theme.spacing(2),
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(0.5),
    borderBottomLeftRadius: theme.radius.sm,
    borderBottomRightRadius: theme.radius.sm,
    backgroundColor: theme.colors.highlight,
  },
  middle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamLogo: {
    width: theme.spacing(14),
    height: theme.spacing(14),
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  centered: {
    textAlign: 'center',
  },
  countdown: {
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  chips: {
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  chip: {
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(1),
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.brandSurface,
  },
  links: {
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  link: {
    flex: 1,
  },
  row: {
    gap: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.mintSurface,
  },
  rowHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  rowLeague: {
    flex: 1,
  },
  rowTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLogo: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  rowActions: {
    flexDirection: 'row',
    gap: theme.spacing(1.5),
  },
}));
