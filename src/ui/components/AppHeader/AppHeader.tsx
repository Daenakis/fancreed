import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import type { AppHeaderProps } from './types';

/** Logo box; the same size anything animating into the logo must land on. */
export const APP_HEADER_LOGO = { width: 32, height: 48 };

/**
 * Top bar of the signed-in app: menu, club logo, profile avatar.
 * Covers the status bar area (safe-area top inset). The logo sits at the
 * exact horizontal centre of the screen, so other screens can line up with
 * it on any device.
 */
export function AppHeader({
  logo,
  onMenuPress,
  onProfilePress,
  onProfileLongPress,
  logoStyle,
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
      <View pointerEvents="none" style={styles.logoBox(insets.top)}>
        <Animated.Image
          source={logo}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          style={[styles.logo, logoStyle]}
        />
      </View>
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
    // The logo is out of the flow; keep the bar as tall as it.
    minHeight: topInset + theme.spacing(4) + APP_HEADER_LOGO.height,
    backgroundColor: theme.colors.background,
  }),
  logoBox: (topInset: number) => ({
    position: 'absolute',
    top: topInset + theme.spacing(2),
    left: 0,
    right: 0,
    alignItems: 'center',
  }),
  logo: APP_HEADER_LOGO,
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.brand,
  },
}));
