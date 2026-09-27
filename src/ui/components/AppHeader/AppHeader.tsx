import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import type { AppHeaderProps } from './types';

/**
 * Top bar of the signed-in app: menu, club logo, profile avatar.
 * Covers the status bar area (safe-area top inset).
 */
export function AppHeader({
  logo,
  onMenuPress,
  onProfilePress,
  onProfileLongPress,
  style,
}: AppHeaderProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar(insets.top), style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('nav.menu')}
        disabled={!onMenuPress}
        hitSlop={8}
        onPress={onMenuPress}
      >
        <Icon name="menu" size={24} color={theme.colors.foreground} />
      </Pressable>
      <Image
        source={logo}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
        style={styles.logo}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('nav.profile')}
        disabled={!onProfilePress && !onProfileLongPress}
        hitSlop={8}
        onPress={onProfilePress}
        onLongPress={onProfileLongPress}
        style={styles.avatar}
      >
        <Icon name="user" size={18} color={theme.colors.primaryForeground} />
      </Pressable>
    </View>
  );
}

AppHeader.displayName = 'AppHeader';

const styles = StyleSheet.create((theme) => ({
  bar: (topInset: number) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: topInset + theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingHorizontal: theme.spacing(5),
    backgroundColor: theme.colors.background,
  }),
  logo: {
    width: theme.spacing(8),
    height: theme.spacing(12),
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.brand,
  },
}));
