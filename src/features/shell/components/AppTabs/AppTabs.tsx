import { usePathname } from 'expo-router';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import { AppHeader, TabBarButton } from '@/ui/components';

import { useLogoutMutation } from '@/hooks';

import { CLUB_LOGO } from '@/constants';

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
 * Signed-in shell: header on top, the active tab's screen, custom tab bar
 * at the bottom (expo-router headless tabs). Home is the start tab.
 */
export function AppTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const logout = useLogoutMutation();
  const pathname = usePathname();
  // Detail screens (e.g. /news/…) bring their own header.
  const onTabRoot = TABS.some((tab) => tab.href === pathname);

  return (
    <Tabs style={styles.root}>
      {/* Menu and profile have no screens yet (waiting for Figma). */}
      {onTabRoot ? (
        <AppHeader
          logo={CLUB_LOGO}
          // Dev-only way out while there's no profile screen.
          onProfileLongPress={__DEV__ ? () => logout.mutate() : undefined}
        />
      ) : null}
      <TabSlot />
      <TabList asChild>
        <View style={styles.tabBar(insets.bottom)}>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabBarButton
                icon={tab.icon}
                activeIcon={tab.activeIcon}
                label={t(tab.label)}
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
