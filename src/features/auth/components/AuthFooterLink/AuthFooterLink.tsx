import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import type { AuthFooterLinkProps } from './types';

/** Centred "Question? Link" line under auth forms. */
export function AuthFooterLink({
  text,
  linkText,
  onPress,
  style,
}: AuthFooterLinkProps) {
  return (
    <View style={[styles.row, style]}>
      <Text variant="bodySRegular" color="onBrand">
        {text}
      </Text>
      <Pressable accessibilityRole="link" hitSlop={8} onPress={onPress}>
        <Text variant="bodySSemibold" color="onBrand">
          {linkText}
        </Text>
      </Pressable>
    </View>
  );
}

AuthFooterLink.displayName = 'AuthFooterLink';

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
}));
