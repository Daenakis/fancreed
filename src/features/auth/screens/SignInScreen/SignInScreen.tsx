import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
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

import { AuthLayout, SignInForm } from '../../components';
import {
  AUTH_LOGO,
  AUTH_LOGO_HEIGHT,
  AUTH_LOGO_SCALE,
  AUTH_LOGO_TOP_OFFSET,
  AUTH_LOGO_WIDTH,
  AUTH_SIDE_PADDING,
} from '../../constants';

const INTRO_DELAY = 600;
const INTRO_DURATION = 800;

// The intro plays once per app launch, not after every sign-out.
let introPlayed = false;

export function SignInScreen() {
  const { t } = useTranslation();
  const router = useRouter();
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
  const startTop = height / 2 - AUTH_LOGO_HEIGHT / 2;
  const endTop = insets.top + AUTH_LOGO_TOP_OFFSET;
  const dx =
    AUTH_SIDE_PADDING + (AUTH_LOGO_WIDTH * AUTH_LOGO_SCALE) / 2 - width / 2;
  const dy = endTop - startTop;

  const introStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [0, dx]) },
      { translateY: interpolate(progress.value, [0, 1], [0, dy]) },
      { scale: interpolate(progress.value, [0, 1], [1, AUTH_LOGO_SCALE]) },
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
  // TODO: wire up when social sign-in exists.
  const notImplemented = () => {};

  return (
    <AuthLayout
      title={t('auth.signInTitle')}
      onSocialPress={notImplemented}
      hideLogo
      contentStyle={contentStyle}
      overlay={
        <Animated.View
          pointerEvents="none"
          style={[styles.intro(startTop), introStyle]}
        >
          <Animated.Image source={AUTH_LOGO} style={styles.logo} />
          <Animated.View style={welcomeStyle}>
            <Text variant="h3Medium" color="onBrand" style={styles.welcome}>
              {t('auth.splashWelcome')}
            </Text>
          </Animated.View>
        </Animated.View>
      }
    >
      <SignInForm
        onSubmit={handleSubmit}
        onForgotPassword={() => router.push('/forgot-password')}
        onCreateAccount={() => router.push('/sign-up')}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  intro: (top: number) => ({
    position: 'absolute',
    top,
    left: 0,
    right: 0,
    alignItems: 'center',
    transformOrigin: 'top',
  }),
  logo: {
    width: AUTH_LOGO_WIDTH,
    height: AUTH_LOGO_HEIGHT,
  },
  welcome: {
    marginTop: theme.spacing(3),
  },
}));
