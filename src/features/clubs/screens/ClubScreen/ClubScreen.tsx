import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Linking, Pressable, Share, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

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
  useClubEventListQuery,
  useClubQuery,
  useFixturesTableQuery,
  useJoinClubMutation,
  useLeaveClubMutation,
} from '@/hooks';

import { goBack, mapsUrl } from '@/utils';

import { EventRow } from '@/features/calendar';

import type { SocialTileProps } from './types';

// TODO: open links in an in-app browser once one is approved (expo-web-browser).
const openLink = (url: string) => void Linking.openURL(url);

/**
 * A fan club: logo, name and description, details, social links and its
 * events. The footer joins / leaves the club; the owner creates events.
 */
export function ClubScreen() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: club, isPending, error } = useClubQuery(id);
  const { data: events } = useClubEventListQuery(id);
  const { data: fixtures } = useFixturesTableQuery();
  const join = useJoinClubMutation();
  const leave = useLeaveClubMutation();

  const matchOf = (fixtureId?: number | null) =>
    fixtureId
      ? [...(fixtures?.future ?? []), ...(fixtures?.past ?? [])].find(
          (m) => m._id === fixtureId,
        )
      : undefined;
  const owner = [club?.owner?.name, club?.owner?.surname]
    .filter(Boolean)
    .join(' ');
  const socials = club
    ? (
        [
          { icon: 'telegram', label: 'Telegram', url: club.telegram },
          { icon: 'instagram', label: 'Instagram', url: club.instagram },
          { icon: 'facebookMono', label: 'Facebook', url: club.facebook },
        ] as const
      ).filter((s) => !!s.url)
    : [];

  const footer = !club ? null : club.youOwner ? (
    <Button
      fullWidth
      backgroundColor="brand"
      textColor="onBrand"
      icon="plus"
      text={t('club.createEvent')}
      onPress={() =>
        router.push({
          pathname: '/gamification/clubs/[id]/events/create',
          params: { id },
        })
      }
    />
  ) : club.youMember ? (
    <Button
      variant="brandLine"
      fullWidth
      icon="userMinus"
      text={t('club.leave')}
      loading={leave.isPending}
      onPress={() => leave.mutate(id)}
    />
  ) : (
    <Button
      fullWidth
      backgroundColor="brand"
      textColor="onBrand"
      icon="userPlus"
      text={t('club.join')}
      loading={join.isPending}
      onPress={() => join.mutate(id)}
    />
  );

  return (
    <PageLayout
      title={club?.name ?? ''}
      onBack={goBack}
      onShare={
        club
          ? () =>
              void Share.share({
                message: t('club.shareMessage', { name: club.name }),
              })
          : undefined
      }
      footer={footer}
      contentStyle={styles.content}
    >
      {isPending ? (
        <LoadingMore loading />
      ) : !club ? (
        <EmptyState
          icon="team"
          title={t('lineup.emptyTitle')}
          text={t(error ? 'club.loadFailed' : 'club.notFound')}
        />
      ) : (
        <>
          <View style={styles.card}>
            <View style={styles.head}>
              {club.origPhoto ? (
                <Image source={{ uri: club.origPhoto }} style={styles.logo} />
              ) : (
                <View style={[styles.logo, styles.logoEmpty]}>
                  <Icon name="cup" size={24} color={theme.colors.onBrand} />
                </View>
              )}
              <Text
                variant="h3Medium"
                accessibilityRole="header"
                style={styles.flex}
              >
                {club.name}
              </Text>
            </View>
            {club.description ? (
              <Text variant="bodySRegular">{club.description}</Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <SectionTitle
              title={t('club.details')}
              variant="bodyLMedium"
              style={styles.flush}
            />
            {club.address ? (
              <InfoRow
                label={t('club.address')}
                value={club.address}
                onPress={() =>
                  openLink(mapsUrl({ location: club.address!, coords: null }))
                }
                icon="location"
              />
            ) : null}
            <InfoRow
              label={t('club.members')}
              value={String((club.totalMembers ?? 0) + 1)}
            />
            {owner ? <InfoRow label={t('club.founder')} value={owner} /> : null}
          </View>

          {socials.length ? (
            <View style={styles.section}>
              <SectionTitle
                title={t('club.socials')}
                variant="bodyLMedium"
                style={styles.flush}
              />
              <View style={styles.socials}>
                {socials.map((social) => (
                  <SocialTile
                    key={social.label}
                    icon={social.icon}
                    label={social.label}
                    url={social.url!}
                  />
                ))}
              </View>
            </View>
          ) : null}

          {events?.length ? (
            <View style={styles.section}>
              <SectionTitle
                title={t('club.events')}
                variant="bodyLMedium"
                style={styles.flush}
              />
              {events.map((event) => (
                <EventRow
                  key={event._id}
                  event={event}
                  showDate
                  match={matchOf(event.fixture)}
                  onPress={() =>
                    router.push({
                      pathname: '/gamification/clubs/[id]/events/[eventId]',
                      params: { id, eventId: event._id },
                    })
                  }
                />
              ))}
            </View>
          ) : null}
        </>
      )}
    </PageLayout>
  );
}

function SocialTile({ icon, label, url }: SocialTileProps) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={() => openLink(url)}
      style={({ pressed }) => [styles.social, pressed && styles.pressed]}
    >
      <Icon name={icon} size={20} color={theme.colors.brand} />
      <Text variant="bodySRegular">{label}</Text>
    </Pressable>
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
    gap: theme.spacing(3),
  },
  logo: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    borderRadius: theme.radius.md,
  },
  logoEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.brand,
  },
  flex: {
    flex: 1,
  },
  section: {
    gap: theme.spacing(2),
  },
  flush: {
    paddingHorizontal: 0,
    marginBottom: theme.spacing(1),
  },
  socials: {
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  social: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingVertical: theme.spacing(3),
    borderWidth: 1,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.brand,
  },
  pressed: {
    opacity: 0.7,
  },
}));
