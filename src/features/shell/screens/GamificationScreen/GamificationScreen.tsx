import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { FanClubsBlock } from '@/features/gamification';

import { ShellHeader } from '../../components';

/**
 * Fan-centre tab. TODO(figma): the tab's real layout — for now a temporary
 * list of fan clubs to reach the club and event screens.
 */
export function GamificationScreen() {
  return (
    <View style={styles.root}>
      <ShellHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <FanClubsBlock
          onOpenClub={(club) =>
            router.push({
              pathname: '/gamification/clubs/[id]',
              params: { id: club._id },
            })
          }
          onCreateClub={() => router.push('/gamification/clubs/create')}
        />
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
    paddingVertical: theme.spacing(4),
  },
}));
