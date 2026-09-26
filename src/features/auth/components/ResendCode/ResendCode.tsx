import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import type { ResendCodeProps } from './types';

/**
 * "Didn't get the code?" line: shows a countdown, then a link that
 * re-sends the code and restarts the countdown.
 */
export function ResendCode({
  onResend,
  cooldownSeconds = 30,
  style,
}: ResendCodeProps) {
  const { t } = useTranslation();
  const [secondsLeft, setSecondsLeft] = useState(cooldownSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const handleResend = () => {
    setSecondsLeft(cooldownSeconds);
    onResend();
  };

  return (
    <View style={[styles.container, style]}>
      {secondsLeft > 0 ? (
        <Text variant="bodySRegular" color="onBrand" style={styles.centered}>
          {`${t('auth.codeNotReceived')} ${t('auth.resendIn')} `}
          <Text variant="bodySSemibold" color="onBrand">
            {t('auth.resendSeconds', { count: secondsLeft })}
          </Text>
        </Text>
      ) : (
        <View style={styles.row}>
          <Text variant="bodySRegular" color="onBrand">
            {t('auth.codeNotReceived')}
          </Text>
          <Pressable
            accessibilityRole="link"
            hitSlop={8}
            onPress={handleResend}
          >
            <Text variant="bodySSemibold" color="onBrand">
              {t('auth.resendCode')}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

ResendCode.displayName = 'ResendCode';

const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    paddingHorizontal: theme.spacing(10),
  },
  centered: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing(1),
  },
}));
