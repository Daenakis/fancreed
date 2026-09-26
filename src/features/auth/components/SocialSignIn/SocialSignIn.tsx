import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '@/ui/components';

import type { SocialProvider, SocialSignInProps } from './types';

const DEFAULT_PROVIDERS: SocialProvider[] = ['google', 'apple', 'facebook'];

const PROVIDER_NAMES: Record<SocialProvider, string> = {
  google: 'Google',
  apple: 'Apple',
  facebook: 'Facebook',
};

/** Row of square "sign in with …" buttons. */
export function SocialSignIn({
  onPress,
  providers = DEFAULT_PROVIDERS,
  style,
}: SocialSignInProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  return (
    <View style={[styles.row, style]}>
      {providers.map((provider) => (
        <Pressable
          key={provider}
          accessibilityRole="button"
          accessibilityLabel={t('auth.signInWith', {
            provider: PROVIDER_NAMES[provider],
          })}
          onPress={() => onPress(provider)}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Icon name={provider} color={theme.colors.socialForeground} />
        </Pressable>
      ))}
    </View>
  );
}

SocialSignIn.displayName = 'SocialSignIn';

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing(3),
  },
  button: {
    width: theme.spacing(11),
    height: theme.spacing(11),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.socialSurface,
  },
  pressed: {
    opacity: 0.8,
  },
}));
