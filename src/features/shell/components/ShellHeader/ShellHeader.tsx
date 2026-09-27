import { router } from 'expo-router';

import { AppHeader } from '@/ui/components';

import { CLUB_LOGO } from '@/constants';

import type { ShellHeaderProps } from './types';

/**
 * The club header of a tab's main screen: logo and the avatar that opens the
 * profile. Rendered by each tab screen (not the tab shell) so it slides away
 * with the screen when a detail screen is pushed.
 */
export function ShellHeader({ style }: ShellHeaderProps) {
  return (
    // The menu has no screen yet (waiting for Figma).
    <AppHeader
      logo={CLUB_LOGO}
      onProfilePress={() => router.push('/profile')}
      style={style}
    />
  );
}

ShellHeader.displayName = 'ShellHeader';
