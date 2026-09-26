import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';

import { TextInput } from '@/ui/components';

import { useLoginMutation, useRecoverPasswordMutation } from '@/hooks';

import { getApiErrorCode, getApiErrorMessageKey } from '@/api';

import { usePendingActivationStore } from '@/store';

import { type NewPasswordFormValues, newPasswordSchema } from '@/schemas';

import {
  AuthButton,
  AuthFooterLink,
  AuthLayout,
  FormError,
} from '../../components';
import { useFieldErrorText } from '../../hooks';

/** Step 3 of password recovery: set the new password, then sign in with it. */
export function NewPasswordScreen() {
  const { t } = useTranslation();
  const errorText = useFieldErrorText();
  const router = useRouter();
  const { email = '', code = '' } = useLocalSearchParams<{
    email: string;
    code: string;
  }>();
  const recoverPassword = useRecoverPasswordMutation();
  const login = useLoginMutation();
  const setPendingActivation = usePendingActivationStore((s) => s.setPending);
  const {
    control,
    handleSubmit,
    trigger,
    getFieldState,
    setError,
    formState: { isValid, errors },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onTouched',
    defaultValues: { password: '', confirmPassword: '' },
  });

  // After a successful reset the user is signed straight in.
  const signInWithNewPassword = (password: string) =>
    login.mutate(
      { login: email, password },
      {
        onSuccess: ({ activated }) => {
          if (activated) return;
          setPendingActivation(email, password);
          router.push({ pathname: '/activate', params: { resend: '1' } });
        },
        onError: () => router.dismissTo('/sign-in'),
      },
    );

  const onSubmit = ({ password }: NewPasswordFormValues) =>
    recoverPassword.mutate(
      { email, code, password },
      {
        onSuccess: () => signInWithNewPassword(password),
        onError: (error) => {
          const codeRejected = ['WRONG_CODE', 'CODE_EXPIRED'].includes(
            getApiErrorCode(error),
          );
          setError('root.server', {
            message: codeRejected
              ? 'auth.errors.codeRejected'
              : getApiErrorMessageKey(error),
          });
        },
      },
    );

  return (
    <AuthLayout
      title={t('auth.newPasswordTitle')}
      subtitle={t('auth.newPasswordSubtitle')}
      centered
      footer={
        <AuthFooterLink
          text={t('auth.rememberedPassword')}
          linkText={t('auth.signIn')}
          onPress={() => router.dismissTo('/sign-in')}
        />
      }
    >
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <TextInput
            variant="inverse"
            error={errorText(fieldState.error)}
            accessibilityLabel={t('auth.newPassword')}
            placeholder={t('auth.newPassword')}
            value={value}
            onChangeText={(text) => {
              onChange(text);
              // Keep the "passwords do not match" error in sync.
              if (getFieldState('confirmPassword').isTouched) {
                void trigger('confirmPassword');
              }
            }}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <TextInput
            variant="inverse"
            error={errorText(fieldState.error)}
            accessibilityLabel={t('auth.repeatPassword')}
            placeholder={t('auth.repeatPassword')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            containerStyle={styles.field}
          />
        )}
      />
      <AuthButton
        title={t('auth.save')}
        disabled={!isValid}
        loading={recoverPassword.isPending || login.isPending}
        onPress={handleSubmit(onSubmit)}
        style={styles.submit}
      />
      <FormError message={errorText(errors.root?.server)} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  field: {
    marginTop: theme.spacing(3),
  },
  submit: {
    marginTop: theme.spacing(6),
  },
}));
