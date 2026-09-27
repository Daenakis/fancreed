import { StyleSheet } from 'react-native-unistyles';

import { Text } from '../Text';
import type { SectionTitleProps } from './types';

/** Left-aligned heading of a screen section, e.g. "Latest news". */
export function SectionTitle({
  title,
  color = 'foreground',
  variant = 'h3Medium',
  style,
}: SectionTitleProps) {
  return (
    <Text
      variant={variant}
      color={color}
      accessibilityRole="header"
      style={[styles.title, style]}
    >
      {title}
    </Text>
  );
}

SectionTitle.displayName = 'SectionTitle';

const styles = StyleSheet.create((theme) => ({
  title: {
    paddingHorizontal: theme.spacing(5),
    marginBottom: theme.spacing(3),
  },
}));
