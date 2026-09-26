import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';

import { Text, TextInput } from '@/ui/components';

import { useRequestPasswordResetMutation } from '@/hooks';

import { type ForgotPasswordFormValues, forgotPasswordSchema } from '@/schemas';

import { AuthButton, AuthFooterLink, AuthLayout } from '../../components';

/** Step 1 of password recovery: ask where to send the code. */
export function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const requestReset = useRequestPasswordResetMutation();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: { login: '' },
  });

  const onSubmit = ({ login }: ForgotPasswordFormValues) =>
    requestReset.mutate(
      { login },
      {
        onSuccess: () =>
          router.push({ pathname: '/verify-code', params: { login } }),
      },
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
        name="login"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            variant="inverse"
            accessibilityLabel={t('auth.loginPlaceholder')}
            placeholder={t('auth.loginPlaceholder')}
            value={value}
            onChangeText={(text) => {
              requestReset.reset();
              onChange(text);
            }}
            onBlur={onBlur}
            autoCapitalize="none"
            autoComplete="username"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="username"
            returnKeyType="send"
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />
      <AuthButton
        title={t('auth.resetPassword')}
        disabled={!isValid}
        loading={requestReset.isPending}
        onPress={handleSubmit(onSubmit)}
        style={styles.submit}
      />
      {requestReset.isError ? (
        <Text
          variant="bodySRegular"
          color="destructiveMuted"
          style={styles.error}
        >
          {t('errors.unknown')}
        </Text>
      ) : null}
    </AuthLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  submit: {
    marginTop: theme.spacing(6),
  },
  error: {
    marginTop: theme.spacing(3),
    textAlign: 'center',
  },
}));
