import { usePathname } from 'expo-router';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type LayoutChangeEvent, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { TabBarButton } from '@/ui/components';

import { getItem, setItem } from '@/utils';

import { useSplashStore } from '@/store';

import { STORAGE_KEYS } from '@/constants';

import { usePrefetchFanCentre } from '../../hooks';
import { OnboardingTour } from '../OnboardingTour';
import type { AppTab, TabIndicatorProps } from './types';

/** Slide between tabs: the same time for any distance, so far is faster. */
const SLIDE_MS = 300;
/** Squash when leaving the tab roots, unsquash when coming back. */
const SQUASH_MS = 750;
const HOME_INDEX = 1;

const TABS: AppTab[] = [
  {
    name: 'gamification',
    href: '/gamification',
    icon: 'asse',
    label: 'nav.gamification',
  },
  {
    name: '(home)',
    href: '/',
    icon: 'home',
    activeIcon: 'homeFill',
    label: 'nav.home',
  },
  {
    name: 'calendar',
    href: '/calendar',
    icon: 'calendar',
    activeIcon: 'calendarFill',
    label: 'nav.calendar',
  },
  {
    name: 'shop',
    href: '/shop',
    icon: 'shop',
    activeIcon: 'shopFill',
    label: 'nav.shop',
  },
];

/** The tab whose stack shows `pathname` (inner screens included). */
const tabIndexOf = (pathname: string) => {
  const index = TABS.findIndex(
    (tab) =>
      tab.href !== '/' &&
      (pathname === tab.href || pathname.startsWith(`${tab.href}/`)),
  );
  return index === -1 ? HOME_INDEX : index;
};

/**
 * Signed-in shell: the active tab's screen with a custom tab bar at the
 * bottom (expo-router headless tabs). Home is the start tab.
 */
export function AppTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  // Home opens first; the Fan-centre tab loads behind it.
  usePrefetchFanCentre();
  // Detail screens (e.g. /news/…) show no tab as selected.
  const onTabRoot = TABS.some((tab) => tab.href === pathname);
  const [barWidth, setBarWidth] = useState(0);
  // First-run tour: on Home, once the welcome splash is gone, until finished
  // (or skipped) once on this device.
  const [tourDone, setTourDone] = useState(
    () => getItem<boolean>(STORAGE_KEYS.ONBOARDING_DONE) === true,
  );
  const splashShown = useSplashStore((s) => !!s.splash);
  const finishTour = () => {
    setItem(STORAGE_KEYS.ONBOARDING_DONE, true);
    setTourDone(true);
  };

  return (
    <Tabs style={styles.root}>
      <TabSlot />
      <TabList asChild>
        <View
          style={styles.tabBar(insets.bottom)}
          onLayout={(event: LayoutChangeEvent) =>
            setBarWidth(event.nativeEvent.layout.width)
          }
        >
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabBarButton
                icon={tab.icon}
                activeIcon={tab.activeIcon}
                label={t(tab.label)}
                inactive={!onTabRoot}
              />
            </TabTrigger>
          ))}
          <TabIndicator
            index={tabIndexOf(pathname)}
            visible={onTabRoot}
            tabWidth={barWidth / TABS.length}
          />
        </View>
      </TabList>
      {!tourDone && !splashShown && pathname === '/' ? (
        <OnboardingTour onDone={finishTour} />
      ) : null}
    </Tabs>
  );
}

AppTabs.displayName = 'AppTabs';

/**
 * The green line above the active tab. Slides to a newly picked tab, squashes
 * away on screens outside the tab roots and unsquashes on the way back — in
 * place when coming back to the same tab, already under the new one otherwise.
 */
function TabIndicator({ index, visible, tabWidth }: TabIndicatorProps) {
  const { theme } = useUnistyles();
  const width = theme.spacing(12);
  const x = useSharedValue<number | null>(null);
  const scale = useSharedValue(visible ? 1 : 0);
  const wasVisible = useRef(visible);

  useEffect(() => {
    if (!tabWidth) return;
    const target = index * tabWidth + (tabWidth - width) / 2;
    // Nothing to slide on first layout or while fully squashed: jump there.
    const hidden = !wasVisible.current && scale.value < 0.05;
    x.value =
      x.value === null || hidden
        ? target
        : withTiming(target, { duration: SLIDE_MS });
    scale.value = withTiming(visible ? 1 : 0, { duration: SQUASH_MS });
    wasVisible.current = visible;
  }, [index, visible, tabWidth, width, x, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: x.value === null ? 0 : 1,
    transform: [{ translateX: x.value ?? 0 }, { scaleX: scale.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.indicator, animatedStyle]}
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabBar: (bottomInset: number) => ({
    flexDirection: 'row',
    paddingBottom: bottomInset,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  }),
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: theme.spacing(12),
    height: 3,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: theme.colors.brand,
  },
}));
