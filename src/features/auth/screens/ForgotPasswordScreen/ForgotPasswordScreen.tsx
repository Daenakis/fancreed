import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';

import { TextInput } from '@/ui/components';

import { useForgotPasswordMutation } from '@/hooks';

import { toFormError } from '@/api';

import { type ForgotPasswordFormValues, forgotPasswordSchema } from '@/schemas';

import {
  AuthButton,
  AuthFooterLink,
  AuthLayout,
  FormError,
} from '../../components';
import { useFieldErrorText } from '../../hooks';

/** Step 1 of password recovery: ask where to send the code. */
export function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const errorText = useFieldErrorText();
  const router = useRouter();
  const forgotPassword = useForgotPasswordMutation();
  const {
    control,
    handleSubmit,
    setError,
    formState: { isValid, errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  });

  const submit = handleSubmit(({ email }) =>
    forgotPassword.mutate(
      { email },
      {
        onSuccess: () =>
          router.push({ pathname: '/verify-code', params: { email } }),
        onError: (error) => {
          const { name, message } = toFormError<'email'>(error, {
            ACCOUNT_NOT_FOUND: 'email',
          });
          setError(name, { message });
        },
      },
    ),
  );

  return (
    <AuthLayout
      title={t('auth.forgotTitle')}
      subtitle={t('auth.forgotSubtitle')}
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
        name="email"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <TextInput
            variant="inverse"
            error={errorText(fieldState.error)}
            accessibilityLabel={t('auth.emailPlaceholder')}
            placeholder={t('auth.emailPlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="username"
            returnKeyType="send"
            onSubmitEditing={submit}
          />
        )}
      />
      <AuthButton
        title={t('auth.resetPassword')}
        disabled={!isValid}
        loading={forgotPassword.isPending}
        onPress={submit}
        style={styles.submit}
      />
      <FormError message={errorText(errors.root?.server)} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  submit: {
    marginTop: theme.spacing(6),
  },
}));
