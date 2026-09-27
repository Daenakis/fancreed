import { useTranslation } from 'react-i18next';
import { Modal, Pressable, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '../Text';
import type { BottomSheetProps } from './types';

/**
 * Panel sliding up from the bottom over a dimmed screen, with a grab handle.
 * Tapping the backdrop closes it.
 *
 * @example
 * <BottomSheet visible={open} onClose={() => setOpen(false)} title={t('profile.size')}>
 *   <ChoiceGroup variant="list" options={sizes} value={size} onChange={pick} />
 * </BottomSheet>
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  style,
}: BottomSheetProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={onClose}
          style={styles.backdrop}
        />
        <Animated.View
          entering={SlideInDown.duration(250)}
          style={[styles.sheet(insets.bottom), style]}
        >
          <View style={styles.handle} />
          {title ? (
            <Text variant="bodyLMedium" accessibilityRole="header">
              {title}
            </Text>
          ) : null}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.shadow,
  },
  sheet: (bottomInset: number) => ({
    gap: theme.spacing(3),
    paddingHorizontal: theme.spacing(4),
    paddingTop: theme.spacing(2),
    paddingBottom: bottomInset + theme.spacing(4),
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    backgroundColor: theme.colors.background,
  }),
  handle: {
    alignSelf: 'center',
    width: theme.spacing(10),
    height: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.foreground,
  },
}));
