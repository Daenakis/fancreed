import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo } from 'react-native';

import {
  useRequestPasswordResetMutation,
  useVerifyResetCodeMutation,
} from '@/hooks';

import { RESET_CODE_LENGTH } from '@/schemas';

import {
  AuthFooterLink,
  AuthLayout,
  CodeInput,
  ResendCode,
} from '../../components';

/**
 * Step 2 of password recovery: the code is checked as soon as the last
 * digit is typed — no submit button.
 */
export function VerifyCodeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login = '' } = useLocalSearchParams<{ login: string }>();
  const verifyCode = useVerifyResetCodeMutation();
  const resendCode = useRequestPasswordResetMutation();
  const [code, setCode] = useState('');

  const handleChange = (next: string) => {
    // Ignore typing while a code is being checked (keeps the keyboard open,
    // unlike disabling the input).
    if (verifyCode.isPending) return;
    verifyCode.reset();
    setCode(next);
    if (next.length !== RESET_CODE_LENGTH) return;

    verifyCode.mutate(
      { login, code: next },
      {
        onSuccess: ({ resetToken }) =>
          router.push({ pathname: '/new-password', params: { resetToken } }),
        // Clear the boxes so a new code can be typed straight away; the
        // red flash + shake is the visual cue, this is for screen readers.
        onError: () => {
          setCode('');
          AccessibilityInfo.announceForAccessibility(
            t('auth.errors.invalidCode'),
          );
        },
      },
    );
  };

  return (
    <AuthLayout
      title={t('auth.codeTitle')}
      subtitle={t('auth.codeSubtitle')}
      centered
      footer={
        <AuthFooterLink
          text={t('auth.rememberedPassword')}
          linkText={t('auth.signIn')}
          onPress={() => router.dismissTo('/sign-in')}
        />
      }
    >
      <CodeInput
        value={code}
        length={RESET_CODE_LENGTH}
        onChangeText={handleChange}
        // TODO(backend): map real error codes (e.g. expired vs invalid).
        error={verifyCode.isError}
        busy={verifyCode.isPending}
        autoFocus
      />
      <ResendCode onResend={() => resendCode.mutate({ login })} />
    </AuthLayout>
  );
}
