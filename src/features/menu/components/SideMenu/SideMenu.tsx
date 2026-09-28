import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  Modal,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { scheduleOnRN } from 'react-native-worklets';

import {
  APP_HEADER_LOGO,
  appHeaderMenuButtonOffset,
  MenuButton,
  MenuRow,
  Text,
} from '@/ui/components';

import { CONFIG } from '@/config';

import type { MenuItem, SideMenuProps } from './types';

const OPEN_MS = 260;
const CLOSE_MS = 220;

// TODO: open links in an in-app browser once one is approved (expo-web-browser).
const openLink = (url: string) => void Linking.openURL(url);

/**
 * Side menu: a full-screen panel sliding in from the left over the app,
 * while the header's menu button stays in place and turns into a cross
 * (tap it to close). In-app sections close it and navigate at the same time
 * (the new screen opens under the sliding-out panel); club pages open on the
 * club site.
 */
export function SideMenu({ visible, onClose }: SideMenuProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const offset = useSharedValue(-width);
  // Stays mounted until the slide-out finishes.
  const [mounted, setMounted] = useState(visible);
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (visible) {
      offset.set(
        withTiming(0, { duration: OPEN_MS, easing: Easing.out(Easing.cubic) }),
      );
    } else {
      offset.set(
        withTiming(
          -width,
          { duration: CLOSE_MS, easing: Easing.in(Easing.cubic) },
          (finished) => {
            if (finished) scheduleOnRN(setMounted, false);
          },
        ),
      );
    }
  }, [visible, width, offset]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.get() }],
  }));

  const openScreen = (
    path: '/tournament' | '/videos' | '/settings' | '/feedback',
  ) => {
    onClose();
    router.push(path);
  };

  const sections: MenuItem[] = [
    {
      key: 'news',
      icon: 'news',
      label: t('menu.news'),
      onPress: () => openLink(CONFIG.LINKS.NEWS_POST),
    },
    {
      key: 'team',
      icon: 'team',
      label: t('menu.team'),
      onPress: () => openLink(CONFIG.LINKS.TEAM),
    },
    {
      key: 'u19',
      icon: 'ball',
      label: t('menu.u19'),
      onPress: () => openLink(CONFIG.LINKS.TEAM_U19),
    },
    // Figma also has a women's team — the club has none on its site yet.
    {
      key: 'tables',
      icon: 'table',
      label: t('menu.tables'),
      onPress: () => openScreen('/tournament'),
    },
    {
      key: 'videos',
      icon: 'video',
      label: t('menu.videos'),
      onPress: () => openScreen('/videos'),
    },
    {
      key: 'academy',
      icon: 'academia',
      label: t('menu.academy'),
      onPress: () => openLink(CONFIG.LINKS.ACADEMY),
    },
  ];
  const footer: MenuItem[] = [
    {
      key: 'settings',
      icon: 'settings',
      label: t('menu.settings'),
      onPress: () => openScreen('/settings'),
    },
    {
      key: 'feedback',
      icon: 'support',
      label: t('menu.feedback'),
      onPress: () => openScreen('/feedback'),
    },
  ];

  const rows = (items: MenuItem[]) =>
    items.map(({ key, ...item }) => <MenuRow key={key} {...item} chevron />);

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.panel, panelStyle]}>
        {/* Same height as the app header, so the title lines up with the
            close button below. */}
        <View style={styles.header(insets.top)}>
          <Text variant="h4Medium" accessibilityRole="header">
            {t('menu.title')}
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.content(insets.bottom)}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.group}>{rows(sections)}</View>
          <View style={styles.group}>{rows(footer)}</View>
        </ScrollView>
      </Animated.View>
      {/* Doesn't slide: it sits exactly on the header's menu button and
          turns from lines into a cross (and back when closing). */}
      <MenuButton
        open={visible}
        onPress={onClose}
        style={[
          styles.close,
          appHeaderMenuButtonOffset(theme.spacing, insets.top),
        ]}
      />
    </Modal>
  );
}

SideMenu.displayName = 'SideMenu';

const styles = StyleSheet.create((theme) => ({
  panel: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  // Mirrors AppHeader's bar: same top padding and row height.
  header: (topInset: number) => ({
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: topInset + theme.spacing(2),
    paddingBottom: theme.spacing(2),
    minHeight: topInset + theme.spacing(4) + APP_HEADER_LOGO.height,
  }),
  // Settings and Feedback stay above the home indicator.
  content: (bottomInset: number) => ({
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing(4),
    paddingTop: theme.spacing(2),
    paddingBottom: bottomInset + theme.spacing(4),
  }),
  close: {
    position: 'absolute',
  },
  group: {
    gap: theme.spacing(2),
  },
}));
