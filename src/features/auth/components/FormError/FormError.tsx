import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import type { FormErrorProps } from './types';

/** Server error under an auth form's submit button (not tied to a field). */
export function FormError({ message, style }: FormErrorProps) {
  if (!message) return null;

  return (
    <Text
      variant="bodySRegular"
      color="destructiveMuted"
      accessibilityRole="alert"
      style={[styles.text, style]}
    >
      {message}
    </Text>
  );
}

FormError.displayName = 'FormError';

const styles = StyleSheet.create((theme) => ({
  text: {
    marginTop: theme.spacing(3),
    textAlign: 'center',
  },
}));
