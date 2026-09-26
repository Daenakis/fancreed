import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useRegisterMutation } from '@/hooks';

import { toFormError } from '@/api';

import { usePendingActivationStore } from '@/store';

import type { SignUpFormInput } from '@/schemas';

import { AuthLayout, SignUpForm, type SignUpFormProps } from '../../components';

export function SignUpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const register = useRegisterMutation();
  const setPendingActivation = usePendingActivationStore((s) => s.setPending);

  const handleSubmit: SignUpFormProps['onSubmit'] = (values, setError) =>
    register.mutate(values, {
      onSuccess: () => {
        setPendingActivation(values.email, values.password);
        router.push('/activate');
      },
      onError: (error) => {
        const { name, message } = toFormError<keyof SignUpFormInput>(error, {
          USER_EXISTS: 'email',
        });
        setError(name, { message });
      },
    });

  // TODO: wire up when social sign-in exists.
  const notImplemented = () => {};

  const goToSignIn = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/sign-in');
  };

  return (
    <AuthLayout title={t('auth.signUpTitle')} onSocialPress={notImplemented}>
      <SignUpForm
        onSubmit={handleSubmit}
        onSignIn={goToSignIn}
        submitting={register.isPending}
      />
    </AuthLayout>
  );
}
