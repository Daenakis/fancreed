import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, useWindowDimensions, View } from 'react-native';
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
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { scheduleOnRN } from 'react-native-worklets';

import { APP_HEADER_LOGO, Text } from '@/ui/components';

import { profileQueryOptions } from '@/hooks';

import { useAuthStore } from '@/store';

import {
  AUTH_LOGO_SCALE,
  AUTH_LOGO_TOP_OFFSET,
  AUTH_SIDE_PADDING,
  CLUB_LOGO,
  CLUB_LOGO_HEIGHT,
  CLUB_LOGO_WIDTH,
} from '@/constants';

import { headerLogoOpacity } from '../../hooks';
import type { WelcomeBackProps } from './types';

/** The greeting slides out from under the logo and fades in. */
const TEXT_MS = 500;
/** After sign-in: the logo comes down from the auth screens' top-left spot. */
const ENTER_MS = 600;
const HOLD_MS = 500;
/** The logo flies into the header logo; the green fades at the very end. */
const EXIT_MS = 600;
/**
 * Then the swap, one fade after the other (together they'd dip — two
 * half-transparent copies look lighter): the header logo fades in under
 * ours, then ours fades out. Both logos overlap exactly, so neither shows.
 */
const SWAP_MS = 150;
/** Plain fade, when there's no header to fly to (signed out, reduced motion). */
const FADE_MS = 250;
/** Slow fade when the app opens on another screen than Home (no logo flight). */
const SLOW_FADE_MS = 600;
/** Give up on the greeting when the profile is this slow. */
const MAX_WAIT_MS = 1500;
/** How far above its place the greeting starts (tucked under the logo). */
const TEXT_START_OFFSET = -40;

/**
 * Welcome splash over the app, on a launch with a stored, still-valid session
 * (`from="center"`: the logo starts centred, as on the sign-in intro) or
 * right after signing in (`from="auth"`: the logo first moves from the auth
 * screens' top-left spot to the centre — the sign-in intro in reverse).
 * Then "Welcome back, {name}!" (or "Welcome, {name}!" for a new account)
 * slides down from the logo; then the logo flies straight up into the Home header's logo
 * (both are centred on the screen) while the green fades away, and the
 * header's own logo fades in over it.
 * Leaves quietly without a greeting when the profile doesn't load (e.g. the
 * token has expired — the app signs out) or takes too long.
 */
export function WelcomeBack({ greeting, from, onDone }: WelcomeBackProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const signedIn = useAuthStore((s) => !!s.accessToken);
  // The logo flies into Home's header; any other first screen (e.g. a deep
  // link) has no header logo to land on — then the splash just fades.
  const onHome = usePathname() === '/';
  // After sign-in we mount a moment before the token is stored: load the
  // profile only once signed in, and treat "signed out" as a reason to
  // leave only after having been signed in.
  const [wasSignedIn, setWasSignedIn] = useState(signedIn);
  if (signedIn && !wasSignedIn) setWasSignedIn(true);
  const signedOut = wasSignedIn && !signedIn;
  const { data: profile, isError } = useQuery({
    ...profileQueryOptions(),
    enabled: signedIn,
  });
  const entering = from === 'auth' && !reduceMotion;
  const [mountedAt] = useState(() => Date.now());
  const enter = useSharedValue(entering ? 0 : 1);
  const text = useSharedValue(0);
  const exit = useSharedValue(0);
  const fade = useSharedValue(1);
  const swap = useSharedValue(0);

  const name = profile?.name?.trim();
  const greeted = !!profile;

  // AppHeader's logo is centred on the screen like ours, so only the
  // height changes: its top sits just under the status bar.
  const startTop = height / 2 - CLUB_LOGO_HEIGHT / 2;
  const dy = insets.top + theme.spacing(2) - startTop;
  const scale = APP_HEADER_LOGO.width / CLUB_LOGO_WIDTH;
  // The auth screens' logo: top-left, scaled down (as in SignInScreen).
  const authDx =
    AUTH_SIDE_PADDING + (CLUB_LOGO_WIDTH * AUTH_LOGO_SCALE) / 2 - width / 2;
  const authDy = insets.top + AUTH_LOGO_TOP_OFFSET - startTop;

  // Hide the header logo under us until ours lands; never leave it hidden.
  useEffect(() => {
    if (entering) {
      enter.value = withTiming(1, {
        duration: ENTER_MS,
        easing: Easing.inOut(Easing.cubic),
      });
    }
    headerLogoOpacity.value = 0;
    return () => {
      headerLogoOpacity.value = 1;
    };
    // Mount-only: the entrance plays once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // The greeting waits for the logo to reach the centre.
    const enterLeft = entering
      ? Math.max(0, ENTER_MS - (Date.now() - mountedAt))
      : 0;
    const finish = (finished?: boolean) => {
      'worklet';
      if (finished) scheduleOnRN(onDone);
    };
    const fadeOut = (delay: number, duration = FADE_MS) => {
      headerLogoOpacity.value = 1;
      fade.value = withDelay(delay, withTiming(0, { duration }, finish));
    };
    const fadeSlowly = (delay: number) => fadeOut(delay, SLOW_FADE_MS);
    const flyToHeader = (delay: number) => {
      exit.value = withDelay(
        delay,
        withTiming(1, {
          duration: EXIT_MS,
          easing: Easing.inOut(Easing.cubic),
        }),
      );
      // Landed: header logo in (under ours), then ours out.
      headerLogoOpacity.value = withDelay(
        delay + EXIT_MS,
        withTiming(1, { duration: SWAP_MS }),
      );
      swap.value = withDelay(
        delay + EXIT_MS + SWAP_MS,
        withTiming(1, { duration: SWAP_MS }, finish),
      );
    };
    const leave = reduceMotion ? fadeOut : onHome ? flyToHeader : fadeSlowly;

    if (signedOut || isError) {
      fadeOut(0);
      return;
    }
    if (greeted) {
      text.value = reduceMotion
        ? 1
        : withDelay(
            enterLeft,
            withTiming(1, {
              duration: TEXT_MS,
              easing: Easing.out(Easing.cubic),
            }),
          );
      leave(enterLeft + (reduceMotion ? 0 : TEXT_MS) + HOLD_MS);
      return;
    }
    // No session yet (sign-in didn't finish): just fade, no header to fly to.
    const timer = setTimeout(
      () => (signedIn ? leave(0) : fadeOut(0)),
      enterLeft + MAX_WAIT_MS,
    );
    return () => clearTimeout(timer);
  }, [
    signedIn,
    signedOut,
    isError,
    greeted,
    reduceMotion,
    onHome,
    entering,
    mountedAt,
    onDone,
    exit,
    fade,
    swap,
    text,
  ]);

  const rootStyle = useAnimatedStyle(() => ({ opacity: fade.value }));
  // The green goes only in the last part, so the logo lands on the header.
  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(exit.value, [0.85, 1], [1, 0], 'clamp'),
  }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: 1 - swap.value,
    transform: [
      { translateX: interpolate(enter.value, [0, 1], [authDx, 0]) },
      {
        translateY:
          interpolate(enter.value, [0, 1], [authDy, 0]) +
          interpolate(exit.value, [0, 1], [0, dy]),
      },
      {
        scale:
          interpolate(enter.value, [0, 1], [AUTH_LOGO_SCALE, 1]) *
          interpolate(exit.value, [0, 1], [1, scale]),
      },
    ],
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: text.value * interpolate(exit.value, [0, 0.3], [1, 0], 'clamp'),
    transform: [
      {
        translateY: interpolate(text.value, [0, 1], [TEXT_START_OFFSET, 0]),
      },
    ],
  }));

  return (
    // Blocks touches to the app underneath until it's gone.
    <Animated.View style={[StyleSheet.absoluteFill, rootStyle]}>
      <Animated.View style={[styles.background, backgroundStyle]} />
      <View style={styles.content(startTop)}>
        <Animated.View style={textStyle}>
          <Text
            variant="h3Medium"
            color="onBrand"
            style={styles.greeting}
            accessibilityRole="header"
          >
            {greeting === 'new'
              ? name
                ? t('auth.welcomeNew', { name })
                : t('auth.splashWelcome')
              : name
                ? t('auth.welcomeBack', { name })
                : t('auth.welcomeBackNoName')}
          </Text>
        </Animated.View>
        {/* Drawn after the greeting so the text slides out from under it. */}
        <Animated.View style={[styles.logo, logoStyle]}>
          {/* `contain` like AppHeader, so the shrunk logo matches it exactly. */}
          <Image
            source={CLUB_LOGO}
            resizeMode="contain"
            style={styles.logoImage}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

WelcomeBack.displayName = 'WelcomeBack';

const styles = StyleSheet.create((theme) => ({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.brand,
  },
  content: (top: number) => ({
    position: 'absolute',
    top,
    left: 0,
    right: 0,
    alignItems: 'center',
  }),
  logo: {
    position: 'absolute',
    top: 0,
    // Scale from the top centre, so only the top edge and centre need to
    // line up with the header logo.
    transformOrigin: 'top',
  },
  logoImage: {
    width: CLUB_LOGO_WIDTH,
    height: CLUB_LOGO_HEIGHT,
  },
  greeting: {
    marginTop: CLUB_LOGO_HEIGHT + theme.spacing(3),
    paddingHorizontal: theme.spacing(4),
    textAlign: 'center',
  },
}));
