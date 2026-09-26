import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useForgotPasswordMutation } from '@/hooks';

import { RECOVERY_CODE_LENGTH } from '@/schemas';

import {
  AuthFooterLink,
  AuthLayout,
  CodeInput,
  ResendCode,
} from '../../components';

/**
 * Step 2 of password recovery: collect the emailed code. The backend has no
 * separate check — the code is verified together with the new password.
 */
export function VerifyCodeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { email = '' } = useLocalSearchParams<{ email: string }>();
  const resendCode = useForgotPasswordMutation();
  const [code, setCode] = useState('');

  const handleChange = (next: string) => {
    setCode(next);
    if (next.length === RECOVERY_CODE_LENGTH) {
      router.push({ pathname: '/new-password', params: { email, code: next } });
    }
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
      {/* TODO: switch to numeric once the real code format is confirmed. */}
      <CodeInput
        value={code}
        length={RECOVERY_CODE_LENGTH}
        inputMode="alphanumeric"
        onChangeText={handleChange}
        autoFocus
      />
      <ResendCode onResend={() => resendCode.mutate({ email })} />
    </AuthLayout>
  );
}
