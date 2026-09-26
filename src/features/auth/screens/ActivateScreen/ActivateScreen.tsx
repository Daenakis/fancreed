import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import {
  useActivateAccountMutation,
  useLoginMutation,
  useResendActivationCodeMutation,
} from '@/hooks';

import { getApiErrorCode, getApiErrorMessageKey } from '@/api';

import { usePendingActivationStore } from '@/store';

import { ACTIVATION_CODE_LENGTH } from '@/schemas';

import {
  AuthFooterLink,
  AuthLayout,
  CodeInput,
  ResendCode,
} from '../../components';

/**
 * Email activation after sign-up (or a sign-in with an unconfirmed email).
 * The code is checked as soon as the last digit is typed; on success the
 * user is signed in with the credentials kept from the previous screen.
 */
export function ActivateScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { resend } = useLocalSearchParams<{ resend?: string }>();
  const { email, password, clear } = usePendingActivationStore(
    useShallow((s) => ({
      email: s.email,
      password: s.password,
      clear: s.clear,
    })),
  );
  const activate = useActivateAccountMutation();
  const login = useLoginMutation();
  const resendCode = useResendActivationCodeMutation();
  const [code, setCode] = useState('');

  // Coming from sign-in: the code sent at registration may be long gone.
  useEffect(() => {
    if (resend === '1' && email) resendCode.mutate({ email });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once on open
  }, []);

  if (!email) return <Redirect href="/sign-in" />;

  const leave = () => {
    clear();
    router.dismissTo('/sign-in');
  };

  const signInAfterActivation = () => {
    if (!password) return leave();
    // A successful login signs in via the mutation; the navigator switches.
    login.mutate(
      { login: email, password },
      { onSuccess: clear, onError: leave },
    );
  };

  const busy = activate.isPending || login.isPending;

  const handleChange = (next: string) => {
    if (busy) return;
    activate.reset();
    setCode(next);
    if (next.length !== ACTIVATION_CODE_LENGTH) return;

    activate.mutate(
      { email, code: next },
      {
        onSuccess: signInAfterActivation,
        onError: (error) => {
          if (getApiErrorCode(error) === 'ALREADY_ACTIVATED') {
            return signInAfterActivation();
          }
          setCode('');
          AccessibilityInfo.announceForAccessibility(
            t(getApiErrorMessageKey(error)),
          );
        },
      },
    );
  };

  return (
    <AuthLayout
      title={t('auth.activateTitle')}
      subtitle={t('auth.activateSubtitle', { email })}
      centered
      footer={
        <AuthFooterLink
          text={t('auth.backToSignIn')}
          linkText={t('auth.signIn')}
          onPress={leave}
        />
      }
    >
      <CodeInput
        value={code}
        length={ACTIVATION_CODE_LENGTH}
        onChangeText={handleChange}
        error={activate.isError}
        busy={busy}
        autoFocus
      />
      <ResendCode onResend={() => resendCode.mutate({ email })} />
    </AuthLayout>
  );
}
