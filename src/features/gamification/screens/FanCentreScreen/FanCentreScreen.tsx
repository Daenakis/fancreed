import { router } from 'expo-router';
import { Linking, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useMyClubsQuery } from '@/hooks';

import { ShellHeader } from '@/features/shell';

import {
  ChallengeBlock,
  ClubEventsBlock,
  FanClubsBlock,
  LineupPredictionBlock,
  MatchdayBlock,
  PredictionBlock,
  QuizBlock,
  VotesBlock,
} from '../../components';

// TODO: open links in an in-app browser once one is approved (expo-web-browser).
const openLink = (url: string) => void Linking.openURL(url);

/**
 * Fan-centre tab (Figma): matchday, fan clubs and their events, players of
 * the match, line-up and score predictions, quiz and the challenge.
 */
export function FanCentreScreen() {
  const { data: myClubs } = useMyClubsQuery();
  // Only a club owner can add events; they go to the fan's own club.
  const ownClub = myClubs?.find((club) => club.youOwner);

  return (
    <View style={styles.root}>
      <ShellHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <MatchdayBlock onOpenLink={openLink} />
        <FanClubsBlock
          onOpenClub={(club) =>
            router.push({
              pathname: '/gamification/clubs/[id]',
              params: { id: club._id },
            })
          }
          onCreateClub={() => router.push('/gamification/clubs/create')}
        />
        <ClubEventsBlock
          onOpenEvent={(event) =>
            event.club?._id &&
            router.push({
              pathname: '/gamification/clubs/[id]/events/[eventId]',
              params: { id: event.club._id, eventId: event._id },
            })
          }
          onCreateEvent={
            ownClub
              ? () =>
                  router.push({
                    pathname: '/gamification/clubs/[id]/events/create',
                    params: { id: ownClub._id },
                  })
              : undefined
          }
        />
        <VotesBlock />
        <LineupPredictionBlock />
        <PredictionBlock />
        <QuizBlock />
        <ChallengeBlock />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    gap: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
}));
