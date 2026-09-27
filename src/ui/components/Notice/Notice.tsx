import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type { NoticeProps } from './types';

/** Light-green hint box with an icon, e.g. "fill in your profile". */
export function Notice({ text, icon = 'info', style }: NoticeProps) {
  const { theme } = useUnistyles();

  return (
    <View accessible accessibilityLabel={text} style={[styles.box, style]}>
      <Icon name={icon} size={14} color={theme.colors.brand} />
      <Text variant="bodyXSMedium" style={styles.text}>
        {text}
      </Text>
    </View>
  );
}

Notice.displayName = 'Notice';

const styles = StyleSheet.create((theme) => ({
  box: {
    flexDirection: 'row',
    gap: theme.spacing(2),
    padding: theme.spacing(3),
    borderWidth: 1,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.mintSurfaceStrong,
    backgroundColor: theme.colors.mintSurface,
  },
  text: {
    flex: 1,
  },
}));
