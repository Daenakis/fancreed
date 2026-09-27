import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Linking, Share, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type { IconName } from '@/ui/assets/icons';
import {
  Button,
  EmptyState,
  Icon,
  InfoRow,
  LoadingMore,
  PageLayout,
  SectionTitle,
  Text,
} from '@/ui/components';

import {
  useClubEventQuery,
  useFixturesTableQuery,
  useJoinClubEventMutation,
  useLeaveClubEventMutation,
} from '@/hooks';

import { eventDate, formatEventDate, goBack, mapsUrl } from '@/utils';

import type { ClubEventKind } from '@/types/api';

import { MatchCard } from '@/features/matches';

const KIND_ICONS: Record<ClubEventKind, IconName> = {
  party: 'party',
  trip: 'bus',
  meeting: 'calendar',
};

// TODO: open links in an in-app browser once one is approved (expo-web-browser).
const openLink = (url: string) => void Linking.openURL(url);

/**
 * A club event: kind, description and members count, then date, address
 * (opens maps) and organiser, and the associated match. The footer joins
 * or leaves it.
 */
export function ClubEventScreen() {
  const { t, i18n } = useTranslation();
  const { theme } = useUnistyles();
  const { id, eventId } = useLocalSearchParams<{
    id: string;
    eventId: string;
  }>();
  const { data: event, isPending } = useClubEventQuery(id, eventId);
  const { data: fixtures } = useFixturesTableQuery();
  const join = useJoinClubEventMutation();
  const leave = useLeaveClubEventMutation();

  const kind = event?.kind ?? 'meeting';
  const kindLabel = t(`events.kind.${kind}`);
  const start = event?.startDate ?? event?.time;
  const place = event?.locations?.[0];
  const owner = [event?.owner?.name, event?.owner?.surname]
    .filter(Boolean)
    .join(' ');
  const match = event?.fixture
    ? [...(fixtures?.future ?? []), ...(fixtures?.past ?? [])].find(
        (m) => m._id === event.fixture,
      )
    : undefined;
  const ref = { clubId: id, eventId };

  const footer =
    !event || event.youOwner ? null : event.youMember ? (
      <Button
        variant="brandLine"
        fullWidth
        icon="userMinus"
        text={t('event.leave')}
        loading={leave.isPending}
        onPress={() => leave.mutate(ref)}
      />
    ) : (
      <Button
        fullWidth
        backgroundColor="brand"
        textColor="onBrand"
        icon="userPlus"
        text={t('event.join')}
        loading={join.isPending}
        onPress={() => join.mutate(ref)}
      />
    );

  return (
    <PageLayout
      title={kindLabel}
      onBack={goBack}
      onShare={
        event && start
          ? () =>
              void Share.share({
                message: `${kindLabel} — ${formatEventDate(eventDate(start), i18n.language)}`,
              })
          : undefined
      }
      footer={footer}
      contentStyle={styles.content}
    >
      {isPending ? (
        <LoadingMore loading />
      ) : !event ? (
        <EmptyState
          icon="party"
          title={t('lineup.emptyTitle')}
          text={t('events.emptyText')}
        />
      ) : (
        <>
          <View style={styles.card}>
            <View style={styles.head}>
              <Icon
                name={KIND_ICONS[kind]}
                size={22}
                color={theme.colors.brand}
              />
              <Text variant="h3Medium" accessibilityRole="header">
                {kindLabel}
              </Text>
            </View>
            {event.description ? (
              <Text variant="bodySRegular">{event.description}</Text>
            ) : null}
            {/* TODO(backend): free places for trips once there's a limit. */}
            <View
              accessible
              accessibilityLabel={`${t('event.members')}: ${(event.totalMembers ?? 0) + 1}`}
              style={styles.stat}
            >
              <Text variant="h4Medium">{(event.totalMembers ?? 0) + 1}</Text>
              <Text variant="bodySRegular">{t('event.members')}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <SectionTitle
              title={t('event.details')}
              variant="bodyLMedium"
              style={styles.flush}
            />
            {start ? (
              <InfoRow
                label={t('event.dateTime')}
                value={formatEventDate(eventDate(start), i18n.language)}
              />
            ) : null}
            {place?.location ? (
              <InfoRow
                label={t('event.address')}
                value={place.location}
                icon="location"
                onPress={() =>
                  openLink(
                    mapsUrl({
                      location: place.location!,
                      coords: place.coords,
                    }),
                  )
                }
              />
            ) : null}
            {owner ? (
              <InfoRow label={t('event.founder')} value={owner} />
            ) : null}
          </View>

          {match ? (
            <View style={styles.section}>
              <SectionTitle
                title={t('event.match')}
                variant="bodyLMedium"
                style={styles.flush}
              />
              <MatchCard match={match} onOpenLink={openLink} />
            </View>
          ) : null}
        </>
      )}
    </PageLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing(5),
    paddingHorizontal: theme.spacing(4),
  },
  card: {
    gap: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.mintSurface,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  stat: {
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingVertical: theme.spacing(3),
    borderWidth: 1,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.mintSurfaceStrong,
    backgroundColor: theme.colors.mintSurfaceStrong,
  },
  section: {
    gap: theme.spacing(2),
  },
  flush: {
    paddingHorizontal: 0,
    marginBottom: theme.spacing(1),
  },
}));
