import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import type { ChallengeBlockProps } from './types';

/**
 * "Challenge" teaser — a green block as in the Figma.
 * TODO(figma/backend): no challenge design or API yet.
 */
export function ChallengeBlock({ style }: ChallengeBlockProps) {
  const { t } = useTranslation();

  return (
    <View style={[styles.block, style]}>
      <Text variant="h3Medium" color="onBrand" accessibilityRole="header">
        {t('challenge.title')}
      </Text>
    </View>
  );
}

ChallengeBlock.displayName = 'ChallengeBlock';

const styles = StyleSheet.create((theme) => ({
  block: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.brand,
  },
}));
