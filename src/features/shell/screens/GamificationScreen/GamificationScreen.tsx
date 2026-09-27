import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { EmptyState } from '@/ui/components';

import { ShellHeader } from '../../components';

/** Placeholder until the Gamification tab has a design. */
export function GamificationScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <ShellHeader />
      <EmptyState
        icon="lion"
        title={`${t('nav.gamification')} — ${t('nav.comingSoon')}`}
        text={t('nav.comingSoonText')}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
