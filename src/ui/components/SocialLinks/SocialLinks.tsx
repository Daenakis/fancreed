import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type { IconName } from '@/ui/assets/icons';
import type { ColorToken } from '@/ui/theme';

import { Icon } from '../Icon';
import { SectionTitle } from '../SectionTitle';
import type { SocialLinksProps } from './types';

/** Backend network name → icon and screen-reader name. Others are hidden. */
const NETWORKS: Record<string, { icon: IconName; label: string }> = {
  facebook: { icon: 'facebookMono', label: 'Facebook' },
  instagram: { icon: 'instagram', label: 'Instagram' },
  telegram: { icon: 'telegram', label: 'Telegram' },
  web: { icon: 'website', label: 'Website' },
  // TODO: swap for a YouTube logo once it's in the Figma icon set.
  youtube: { icon: 'video', label: 'YouTube' },
  tiktok: { icon: 'tiktok', label: 'TikTok' },
  x: { icon: 'xTwitter', label: 'X' },
  // The backend needs 3+ characters in a name.
  twitter: { icon: 'xTwitter', label: 'X' },
};

/**
 * The club's social networks on a green block: an optional title, then a
 * row of outlined icon squares. Unknown networks and empty links are skipped.
 *
 * @example
 * <SocialLinks title={t('home.socials')} links={socials} onOpen={(l) => Linking.openURL(l.url)} />
 */
export function SocialLinks({
  links,
  onOpen,
  title,
  iconColor = 'onBrand',
  style,
}: SocialLinksProps) {
  const { theme } = useUnistyles();
  const shown = links.filter((link) => link.url && NETWORKS[link.name]);

  if (!shown.length) return null;

  return (
    <View style={[styles.container, style]}>
      {title ? (
        <SectionTitle title={title} color={iconColor} style={styles.title} />
      ) : null}
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
              style={({ pressed }) => [
                styles.square(iconColor),
                pressed && styles.pressed,
              ]}
            >
              <Icon
                name={network.icon}
                size={20}
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
    paddingVertical: theme.spacing(5),
    backgroundColor: theme.colors.brand,
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing(3),
    paddingHorizontal: theme.spacing(5),
  },
  square: (color: ColorToken) => ({
    flex: 1,
    maxWidth: theme.spacing(12),
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    borderColor: theme.colors[color],
  }),
  pressed: {
    opacity: 0.7,
  },
}));
