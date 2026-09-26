import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '@/store';

import { AuthLayout, SignUpForm } from '../../components';

export function SignUpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);

  // TODO: real registration once the backend has a sign-up endpoint.
  const handleSubmit = () => signIn('mock-access-token', 'mock-refresh-token');
  // TODO: wire up when social sign-in exists.
  const notImplemented = () => {};

  const goToSignIn = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/sign-in');
  };

  return (
    <AuthLayout title={t('auth.signUpTitle')} onSocialPress={notImplemented}>
      <SignUpForm onSubmit={handleSubmit} onSignIn={goToSignIn} />
    </AuthLayout>
  );
}
