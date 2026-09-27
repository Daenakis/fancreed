import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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

import { useLoginMutation } from '@/hooks';

import { toFormError } from '@/api';

import { usePendingActivationStore, useSplashStore } from '@/store';

import type { SignInFormValues } from '@/schemas';

import { AuthLayout, SignInForm, type SignInFormProps } from '../../components';
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

export function SignInScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const login = useLoginMutation();
  const setPendingActivation = usePendingActivationStore((s) => s.setPending);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  // Due on app start and after signing out; not when coming back from the
  // other auth screens.
  const [playIntro] = useState(
    () => useSplashStore.getState().signInIntro && !reduceMotion,
  );
  const progress = useSharedValue(playIntro ? 0 : 1);

  useEffect(() => {
    if (!playIntro) return;
    useSplashStore.getState().consumeSignInIntro();
    progress.value = 0;
    progress.value = withDelay(
      INTRO_DELAY,
      withTiming(1, {
        duration: INTRO_DURATION,
        easing: Easing.inOut(Easing.cubic),
      }),
    );
  }, [progress, playIntro]);

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

  // Activated accounts are signed in by the mutation (the navigator then
  // switches to the app); unactivated ones go to email activation first.
  const handleSubmit: SignInFormProps['onSubmit'] = (values, setError) =>
    login.mutate(values, {
      onSuccess: ({ activated }) => {
        if (activated) return;
        setPendingActivation(values.login, values.password);
        router.push({ pathname: '/activate', params: { resend: '1' } });
      },
      onError: (error) => {
        const { name, message } = toFormError<keyof SignInFormValues>(error, {
          WRONG_PASSWORD: 'password',
          ACCOUNT_NOT_FOUND: 'login',
        });
        setError(name, { message });
      },
    });
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
          <Animated.Image
            source={AUTH_LOGO}
            resizeMode="contain"
            style={styles.logo}
          />
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
        submitting={login.isPending}
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
