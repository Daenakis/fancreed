import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { APP_HEADER_LOGO, Button, Icon, Text } from '@/ui/components';

import type {
  OnboardingStep,
  OnboardingTourProps,
  SpotlightProps,
} from './types';

const STEPS: OnboardingStep[] = [
  { key: 'menu', target: { kind: 'menu' } },
  { key: 'profile', target: { kind: 'profile' } },
  {
    key: 'gamification',
    target: { kind: 'tab', index: 0, icon: 'asse' },
  },
  { key: 'home', target: { kind: 'tab', index: 1, icon: 'homeFill' } },
  {
    key: 'calendar',
    target: { kind: 'tab', index: 2, icon: 'calendarFill' },
  },
  { key: 'shop', target: { kind: 'tab', index: 3, icon: 'shopFill' } },
];

const TAB_COUNT = 4;
/** White circle around the highlighted control (Figma: ~48 pt). */
const SPOT = 48;
/** AppHeader's menu icon and TabBarButton's icon size. */
const ICON = 24;
const ARROW = 12;
/** iOS blur strength behind the tour. */
const BLUR = 30;

/**
 * First-run tour of the app shell (Figma "Онбординг"): the app dims, one
 * control at a time is lifted into a white circle — menu, profile, then the
 * four tabs — with a card explaining it (step, title, text, Back / Next).
 * Positions mirror AppHeader and the tab bar, so they fit any screen size.
 */
export function OnboardingTour({ onDone }: OnboardingTourProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const step = STEPS[index]!;
  const last = index === STEPS.length - 1;
  const { target } = step;

  // Centre of the highlighted control (see AppHeader / TabBarButton styles).
  const headerY = insets.top + theme.spacing(2) + APP_HEADER_LOGO.height / 2;
  const x =
    target.kind === 'menu'
      ? theme.spacing(5) + ICON / 2
      : target.kind === 'profile'
        ? width - theme.spacing(5) - theme.spacing(8) / 2
        : ((target.index + 0.5) * width) / TAB_COUNT;
  const y =
    target.kind === 'tab'
      ? height - insets.bottom - theme.spacing(2) - ICON / 2
      : headerY;
  const below = target.kind !== 'tab';
  const side = theme.spacing(4);
  // The arrow stays under the control, inside the card's rounded corners.
  const arrowLeft = Math.min(
    Math.max(x - side - ARROW / 2, theme.spacing(4)),
    width - 2 * side - theme.spacing(4) - ARROW,
  );
  const gap = SPOT / 2 + ARROW / 2 + theme.spacing(1);

  const finish = () => {
    setVisible(false);
    onDone?.();
  };
  const next = () => (last ? finish() : setIndex(index + 1));

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.root}
      accessibilityViewIsModal
    >
      {/* iOS blurs the app; Android's blur is slow/limited — a darker dim. */}
      {Platform.OS === 'ios' ? (
        <BlurView intensity={BLUR} tint="dark" style={styles.fill} />
      ) : (
        <View style={[styles.fill, styles.scrim]} />
      )}
      <Spotlight target={target} x={x} y={y} />
      <Animated.View
        key={step.key}
        entering={FadeIn}
        style={[
          styles.card,
          below ? { top: y + gap } : { bottom: height - y + gap },
        ]}
      >
        <View
          style={[
            styles.arrow,
            below ? styles.arrowTop : styles.arrowBottom,
            { left: arrowLeft },
          ]}
        />
        <View style={styles.top}>
          <Text variant="bodySRegular" color="mutedForeground">
            <Text variant="bodySRegular" color="brand">
              {index + 1}
            </Text>
            {`/${STEPS.length}`}
          </Text>
          {last ? null : (
            <Pressable accessibilityRole="button" onPress={finish} hitSlop={8}>
              <Text variant="bodySSemibold" color="brand">
                {t('onboarding.skip')}
              </Text>
            </Pressable>
          )}
        </View>
        <Text variant="bodyLMedium" accessibilityRole="header">
          {t(`onboarding.${step.key}.title`)}
        </Text>
        <Text variant="bodyMRegular" color="foreground">
          {t(`onboarding.${step.key}.text`)}
        </Text>
        <View style={styles.actions}>
          {index > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('onboarding.back')}
              onPress={() => setIndex(index - 1)}
              style={({ pressed }) => [styles.back, pressed && styles.pressed]}
            >
              <Icon name="arrowLeft" size={20} color={theme.colors.brand} />
            </Pressable>
          ) : null}
          <Button
            text={t(last ? 'onboarding.finish' : 'onboarding.next')}
            backgroundColor="brand"
            textColor="onBrand"
            size="sm"
            onPress={next}
            style={styles.action}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

OnboardingTour.displayName = 'OnboardingTour';

function Spotlight({ target, x, y }: SpotlightProps) {
  const { theme } = useUnistyles();

  return (
    <View
      pointerEvents="none"
      style={[styles.spot, { left: x - SPOT / 2, top: y - SPOT / 2 }]}
    >
      {target.kind === 'profile' ? (
        <View style={styles.avatar}>
          <Icon name="user" size={18} color={theme.colors.primaryForeground} />
        </View>
      ) : (
        <Icon
          name={target.kind === 'menu' ? 'menu' : target.icon}
          size={ICON}
          color={
            target.kind === 'menu'
              ? theme.colors.foreground
              : theme.colors.brand
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: {
    ...StyleSheet.absoluteFillObject,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  scrim: {
    backgroundColor: theme.colors.scrim,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  back: {
    width: theme.spacing(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.brand,
    borderRadius: theme.radius.md,
  },
  pressed: {
    opacity: 0.7,
  },
  spot: {
    position: 'absolute',
    width: SPOT,
    height: SPOT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background,
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.brand,
  },
  card: {
    position: 'absolute',
    left: theme.spacing(4),
    right: theme.spacing(4),
    gap: theme.spacing(2),
    padding: theme.spacing(3),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background,
  },
  arrow: {
    position: 'absolute',
    width: ARROW,
    height: ARROW,
    backgroundColor: theme.colors.background,
    transform: [{ rotate: '45deg' }],
  },
  arrowTop: {
    top: -ARROW / 2,
  },
  arrowBottom: {
    bottom: -ARROW / 2,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  action: {
    flex: 1,
  },
}));
