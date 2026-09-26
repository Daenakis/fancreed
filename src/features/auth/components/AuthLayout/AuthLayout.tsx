import { StatusBar } from 'expo-status-bar';
import { Image, Keyboard, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import {
  AUTH_LOGO,
  AUTH_LOGO_HEIGHT,
  AUTH_LOGO_SCALE,
  AUTH_LOGO_TOP_OFFSET,
  AUTH_LOGO_WIDTH,
  AUTH_SIDE_PADDING,
} from '../../constants';
import { SocialSignIn } from '../SocialSignIn';
import type { AuthLayoutProps } from './types';

/**
 * Brand-green auth screen shell: logo top-left, title, form, and social
 * sign-in pinned to the bottom. Tapping outside a field hides the keyboard.
 */
export function AuthLayout({
  title,
  subtitle,
  centered = false,
  children,
  onSocialPress,
  hideLogo = false,
  contentStyle,
  footer,
  overlay,
}: AuthLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      accessible={false}
      onPress={Keyboard.dismiss}
      style={styles.container}
    >
      <StatusBar style="light" />
      {hideLogo ? null : (
        <Image source={AUTH_LOGO} style={styles.logo(insets.top)} />
      )}
      <Animated.View style={[styles.content(insets.top), contentStyle]}>
        <Text
          variant="h4Medium"
          color="onBrand"
          accessibilityRole="header"
          style={[styles.title(!!subtitle), centered && styles.centered]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            variant="bodyMRegular"
            color="onBrand"
            style={[styles.subtitle, centered && styles.centered]}
          >
            {subtitle}
          </Text>
        ) : null}
        {children}
      </Animated.View>
      {onSocialPress ? (
        <Animated.View style={[styles.social(insets.bottom), contentStyle]}>
          <SocialSignIn onPress={onSocialPress} />
        </Animated.View>
      ) : null}
      {footer ? (
        <Animated.View style={[styles.social(insets.bottom), contentStyle]}>
          {footer}
        </Animated.View>
      ) : null}
      {overlay}
    </Pressable>
  );
}

AuthLayout.displayName = 'AuthLayout';

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.brand,
  },
  logo: (topInset: number) => ({
    position: 'absolute',
    top: topInset + AUTH_LOGO_TOP_OFFSET,
    left: AUTH_SIDE_PADDING,
    width: AUTH_LOGO_WIDTH * AUTH_LOGO_SCALE,
    height: AUTH_LOGO_HEIGHT * AUTH_LOGO_SCALE,
  }),
  content: (topInset: number) => ({
    paddingTop:
      topInset + AUTH_LOGO_TOP_OFFSET + AUTH_LOGO_HEIGHT * AUTH_LOGO_SCALE,
    paddingHorizontal: AUTH_SIDE_PADDING,
  }),
  title: (hasSubtitle: boolean) => ({
    marginTop: theme.spacing(24),
    marginBottom: hasSubtitle ? theme.spacing(2) : theme.spacing(4),
  }),
  subtitle: {
    marginBottom: theme.spacing(5),
  },
  centered: {
    textAlign: 'center',
  },
  social: (bottomInset: number) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: bottomInset + theme.spacing(2),
  }),
}));
