import { Pressable, type StyleProp, type TextStyle, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type { SectionTitleProps } from './types';

/**
 * Left-aligned heading of a screen section, e.g. "Latest news". An
 * optional icon button sits on the right (e.g. "+" to create).
 */
export function SectionTitle({
  title,
  color = 'foreground',
  variant = 'h3Medium',
  action,
  style,
}: SectionTitleProps) {
  const { theme } = useUnistyles();
  const heading = (
    <Text
      variant={variant}
      color={color}
      accessibilityRole="header"
      style={
        action ? styles.flex : [styles.title, style as StyleProp<TextStyle>]
      }
    >
      {title}
    </Text>
  );

  if (!action) return heading;

  return (
    <View style={[styles.title, styles.row, style]}>
      {heading}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={action.label}
        hitSlop={12}
        onPress={action.onPress}
      >
        <Icon name={action.icon} size={20} color={theme.colors[color]} />
      </Pressable>
    </View>
  );
}

SectionTitle.displayName = 'SectionTitle';

const styles = StyleSheet.create((theme) => ({
  title: {
    paddingHorizontal: theme.spacing(5),
    marginBottom: theme.spacing(3),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
}));
