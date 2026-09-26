import { Image, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { ColorToken } from '@/ui/theme';

import { Text } from '../Text';
import type { BlockHeaderProps } from './types';

/**
 * Tab-shaped title on top of a content block: coloured background, rounded
 * bottom corners and a soft shadow. Optional image or team logos go before
 * the title; without them the title is centred.
 *
 * @example
 * <BlockHeader title={t('home.table')} backgroundColor="background" textColor="foreground" />
 */
export function BlockHeader({
  title,
  backgroundColor = 'primary',
  textColor = 'primaryForeground',
  image,
  teamLogos,
  bordered = false,
  style,
  ref,
}: BlockHeaderProps) {
  const hasLeading = !!image || !!teamLogos;

  return (
    <View
      ref={ref}
      accessible
      accessibilityRole="header"
      style={[
        styles.container(backgroundColor, hasLeading),
        bordered && styles.bordered,
        style,
      ]}
    >
      {teamLogos?.map((logo, i) => (
        <Image
          key={i}
          source={logo}
          resizeMode="contain"
          style={styles.teamLogo}
        />
      ))}
      {image ? <Image source={image} style={styles.image} /> : null}
      <Text variant="h3Medium" color={textColor} style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

BlockHeader.displayName = 'BlockHeader';

const styles = StyleSheet.create((theme, rt) => ({
  container: (backgroundColor: ColorToken, hasLeading: boolean) => ({
    flexDirection: hasLeading ? 'row' : 'column',
    alignItems: hasLeading ? 'center' : 'stretch',
    minWidth: rt.screen.width * 0.3,
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(3),
    borderBottomLeftRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    backgroundColor: theme.colors[backgroundColor],
    boxShadow: `0 2px 4px ${theme.colors.shadow}`,
  }),
  bordered: {
    borderColor: theme.colors.foreground,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    textAlign: 'center',
  },
  image: {
    width: 50,
    height: 23,
    marginRight: theme.spacing(1),
  },
  teamLogo: {
    width: theme.spacing(5.5),
    height: theme.spacing(5.5),
  },
}));
