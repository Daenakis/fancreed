import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import { useAuthStore } from '@/store';

import { SignInForm, SocialSignIn } from '../../components';

const LOGO = require('../../../../../assets/exampleLogo.png');
const LOGO_WIDTH = 84;
const LOGO_HEIGHT = 126;
/** Collapsed logo is 40 px wide, top-left above the form. */
const LOGO_SCALE = 40 / LOGO_WIDTH;
const SIDE_PADDING = 18;
const LOGO_TOP_OFFSET = 12;

const INTRO_DELAY = 600;
const INTRO_DURATION = 800;

// The intro plays once per app launch, not after every sign-out.
let introPlayed = false;

export function SignInScreen() {
  const { t } = useTranslation();
  const signIn = useAuthStore((s) => s.signIn);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(introPlayed || reduceMotion ? 1 : 0);

  useEffect(() => {
    if (introPlayed || reduceMotion) return;
    introPlayed = true;
    progress.value = 0;
    progress.value = withDelay(
      INTRO_DELAY,
      withTiming(1, {
        duration: INTRO_DURATION,
        easing: Easing.inOut(Easing.cubic),
      }),
    );
  }, [progress, reduceMotion]);

  // Logo starts centred on screen and ends top-left, scaled down.
  // transformOrigin is the logo's top centre, so only its top edge and
  // horizontal centre need to line up with the target.
  const startTop = height / 2 - LOGO_HEIGHT / 2;
  const endTop = insets.top + LOGO_TOP_OFFSET;
  const dx = SIDE_PADDING + (LOGO_WIDTH * LOGO_SCALE) / 2 - width / 2;
  const dy = endTop - startTop;

  const introStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [0, dx]) },
      { translateY: interpolate(progress.value, [0, 1], [0, dy]) },
      { scale: interpolate(progress.value, [0, 1], [1, LOGO_SCALE]) },
    ],
  }));
  const welcomeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5], [1, 0], 'clamp'),
  }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.4, 1], [0, 1], 'clamp'),
  }));

  // TODO: real login via useLoginMutation once the backend contract is confirmed
  // (form field `login` = email or phone; LoginRequest has only `email`).
  const handleSubmit = () => signIn('mock-access-token', 'mock-refresh-token');
  // TODO: wire up when the forgot-password / sign-up / social flows exist.
  const notImplemented = () => {};

  return (
    <Pressable
      accessible={false}
      onPress={Keyboard.dismiss}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Animated.View style={[styles.content(insets.top), contentStyle]}>
        <Text
          variant="h4Medium"
          color="onBrand"
          accessibilityRole="header"
          style={styles.title}
        >
          {t('auth.signInTitle')}
        </Text>
        <SignInForm
          onSubmit={handleSubmit}
          onForgotPassword={notImplemented}
          onCreateAccount={notImplemented}
        />
      </Animated.View>
      <Animated.View style={[styles.social(insets.bottom), contentStyle]}>
        <SocialSignIn onPress={notImplemented} />
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[styles.intro(startTop), introStyle]}
      >
        <Animated.Image source={LOGO} style={styles.logo} />
        <Animated.View style={welcomeStyle}>
          <Text variant="h3Medium" color="onBrand" style={styles.welcome}>
            {t('auth.splashWelcome')}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.brand,
  },
  content: (topInset: number) => ({
    paddingTop: topInset + LOGO_TOP_OFFSET + LOGO_HEIGHT * LOGO_SCALE,
    paddingHorizontal: SIDE_PADDING,
  }),
  title: {
    marginTop: theme.spacing(24),
    marginBottom: theme.spacing(4),
  },
  social: (bottomInset: number) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: bottomInset + theme.spacing(2),
  }),
  intro: (top: number) => ({
    position: 'absolute',
    top,
    left: 0,
    right: 0,
    alignItems: 'center',
    transformOrigin: 'top',
  }),
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
  welcome: {
    marginTop: theme.spacing(3),
  },
}));
