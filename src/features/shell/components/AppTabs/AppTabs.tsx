import { usePathname } from 'expo-router';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import { TabBarButton } from '@/ui/components';

import type { AppTab } from './types';

const TABS: AppTab[] = [
  {
    name: 'gamification',
    href: '/gamification',
    icon: 'lion',
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

/**
 * Signed-in shell: the active tab's screen with a custom tab bar at the
 * bottom (expo-router headless tabs). Home is the start tab.
 */
export function AppTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  // Detail screens (e.g. /news/…) show no tab as selected.
  const onTabRoot = TABS.some((tab) => tab.href === pathname);

  return (
    <Tabs style={styles.root}>
      <TabSlot />
      <TabList asChild>
        <View style={styles.tabBar(insets.bottom)}>
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
        </View>
      </TabList>
    </Tabs>
  );
}

AppTabs.displayName = 'AppTabs';

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
}));
