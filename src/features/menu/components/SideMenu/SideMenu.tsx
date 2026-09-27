import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Modal, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import { scheduleOnRN } from 'react-native-worklets';

import { MenuRow, PageLayout } from '@/ui/components';

import { CONFIG } from '@/config';

import type { MenuItem, SideMenuProps } from './types';

const OPEN_MS = 260;
const CLOSE_MS = 220;

// TODO: open links in an in-app browser once one is approved (expo-web-browser).
const openLink = (url: string) => void Linking.openURL(url);

/**
 * Side menu: a full-screen panel sliding in from the left over the app.
 * In-app sections close it and navigate at the same time (the new screen
 * opens under the sliding-out panel); club pages open on the club site.
 */
export function SideMenu({ visible, onClose }: SideMenuProps) {
  const { t } = useTranslation();
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

  const openScreen = (path: '/standings' | '/videos') => {
    onClose();
    router.push(path);
  };
  const comingSoon = () => Alert.alert(t('menu.comingSoon'));

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
      onPress: () => openScreen('/standings'),
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
  // TODO: settings and feedback screens (no design yet).
  const footer: MenuItem[] = [
    {
      key: 'settings',
      icon: 'settings',
      label: t('menu.settings'),
      onPress: comingSoon,
    },
    {
      key: 'feedback',
      icon: 'support',
      label: t('menu.feedback'),
      onPress: comingSoon,
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
        <PageLayout
          tone="plain"
          title={t('menu.title')}
          onBack={onClose}
          contentStyle={styles.content}
        >
          <View style={styles.group}>{rows(sections)}</View>
          <View style={styles.group}>{rows(footer)}</View>
        </PageLayout>
      </Animated.View>
    </Modal>
  );
}

SideMenu.displayName = 'SideMenu';

const styles = StyleSheet.create((theme) => ({
  panel: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing(4),
  },
  group: {
    gap: theme.spacing(2),
  },
}));
