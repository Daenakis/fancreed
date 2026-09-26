import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';

import { Text, TextInput } from '@/ui/components';

import { useResetPasswordMutation } from '@/hooks';

import { type NewPasswordFormValues, newPasswordSchema } from '@/schemas';

import { AuthButton, AuthFooterLink, AuthLayout } from '../../components';

/** Step 3 of password recovery: set the new password, then back to sign-in. */
export function NewPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { resetToken = '' } = useLocalSearchParams<{ resetToken: string }>();
  const resetPassword = useResetPasswordMutation();
  const {
    control,
    handleSubmit,
    formState: { isValid, errors, dirtyFields },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  });

  // Only complain about a mismatch once the user has typed the repeat.
  const mismatch =
    dirtyFields.confirmPassword &&
    errors.confirmPassword?.message === 'auth.errors.passwordsMismatch';

  const onSubmit = ({ password }: NewPasswordFormValues) =>
    resetPassword.mutate(
      { resetToken, password },
      { onSuccess: () => router.dismissTo('/sign-in') },
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
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            variant="inverse"
            accessibilityLabel={t('auth.newPassword')}
            placeholder={t('auth.newPassword')}
            value={value}
            onChangeText={onChange}
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
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            variant="inverse"
            accessibilityLabel={t('auth.repeatPassword')}
            placeholder={t('auth.repeatPassword')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            error={mismatch ? t('auth.errors.passwordsMismatch') : undefined}
            containerStyle={styles.field}
          />
        )}
      />
      <AuthButton
        title={t('auth.save')}
        disabled={!isValid}
        loading={resetPassword.isPending}
        onPress={handleSubmit(onSubmit)}
        style={styles.submit}
      />
      {resetPassword.isError ? (
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
  field: {
    marginTop: theme.spacing(3),
  },
  submit: {
    marginTop: theme.spacing(6),
  },
  error: {
    marginTop: theme.spacing(3),
    textAlign: 'center',
  },
}));
