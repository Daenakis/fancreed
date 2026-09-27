import { useTranslation } from 'react-i18next';
import { Modal, Pressable, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon, Text } from '@/ui/components';

import { FanCard } from '../FanCard';
import type { FanCardModalProps } from './types';

/**
 * Full-screen FAN ID card in landscape. The app is portrait-only, so the
 * content is rotated instead of the device orientation; tap flips the card.
 */
export function FanCardModal({ visible, onClose, ...card }: FanCardModalProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={['portrait']}
    >
      <View style={styles.screen}>
        <View style={styles.landscape(width, height, insets.top)}>
          <View style={styles.header}>
            <Text variant="bodyMMedium">{t('fanCard.fullTitle')}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              hitSlop={12}
              onPress={onClose}
            >
              <Icon name="close" color={theme.colors.foreground} />
            </Pressable>
          </View>
          <FanCard {...card} variant="full" />
        </View>
      </View>
    </Modal>
  );
}

FanCardModal.displayName = 'FanCardModal';

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  // Swap the sides and turn a quarter clockwise; keep clear of the notch.
  landscape: (width: number, height: number, notch: number) => ({
    width: height - notch * 2,
    height: width,
    paddingHorizontal: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    transform: [{ rotate: '90deg' }],
  }),
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing(3),
  },
}));
