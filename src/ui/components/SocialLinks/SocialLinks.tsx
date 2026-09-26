import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type { IconName } from '@/ui/assets/icons';

import { BlockHeader } from '../BlockHeader';
import { Icon } from '../Icon';
import type { SocialLinksProps } from './types';

/** Backend network name → icon and screen-reader name. Others are hidden. */
const NETWORKS: Record<string, { icon: IconName; label: string }> = {
  facebook: { icon: 'facebook', label: 'Facebook' },
  instagram: { icon: 'instagram', label: 'Instagram' },
  telegram: { icon: 'telegram', label: 'Telegram' },
  web: { icon: 'website', label: 'Website' },
  // TODO: swap for a YouTube logo once it's in the Figma icon set.
  youtube: { icon: 'video', label: 'YouTube' },
  tiktok: { icon: 'tiktok', label: 'TikTok' },
  x: { icon: 'xTwitter', label: 'X' },
};

/**
 * The club's social networks as a row of icon buttons, optionally under a
 * BlockHeader. Unknown networks and empty links are skipped.
 *
 * @example
 * <SocialLinks title={t('home.socials')} links={socials} onOpen={(l) => Linking.openURL(l.url)} />
 */
export function SocialLinks({
  links,
  onOpen,
  title,
  iconColor = 'foreground',
  style,
}: SocialLinksProps) {
  const { theme } = useUnistyles();
  const shown = links.filter((link) => link.url && NETWORKS[link.name]);

  if (!shown.length) return null;

  return (
    <View style={[styles.container, style]}>
      {title ? <BlockHeader title={title} /> : null}
      <View style={styles.row}>
        {shown.map((link) => {
          const network = NETWORKS[link.name]!;
          return (
            <Pressable
              key={link.name}
              accessibilityRole="link"
              accessibilityLabel={network.label}
              hitSlop={8}
              onPress={() => onOpen(link)}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Icon
                name={network.icon}
                size={32}
                color={theme.colors[iconColor]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

SocialLinks.displayName = 'SocialLinks';

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing(6),
    paddingVertical: theme.spacing(6),
  },
  pressed: {
    opacity: 0.7,
  },
}));
