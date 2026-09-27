import { router } from 'expo-router';
import { useState } from 'react';

import { AppHeader } from '@/ui/components';

import { CLUB_LOGO } from '@/constants';

import { SideMenu } from '@/features/menu';

import { useHeaderLogoReveal } from '../../hooks';
import type { ShellHeaderProps } from './types';

/**
 * The club header of a tab's main screen: burger (opens the side menu),
 * logo and the avatar that opens the profile. Rendered by each tab screen (not the tab shell) so it slides away
 * with the screen when a detail screen is pushed.
 */
export function ShellHeader({ style }: ShellHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoStyle = useHeaderLogoReveal();

  return (
    <>
      <AppHeader
        logo={CLUB_LOGO}
        logoStyle={logoStyle}
        onMenuPress={() => setMenuOpen(true)}
        onProfilePress={() => router.push('/profile')}
        style={style}
      />
      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

ShellHeader.displayName = 'ShellHeader';
