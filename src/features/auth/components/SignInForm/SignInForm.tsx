import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button, Text, TextInput } from '@/ui/components';

import { useFieldErrorText, useSubmitForm } from '@/hooks';

import { type SignInFormValues, signInSchema } from '@/schemas';

import { CONFIG } from '@/config';

import { AuthFooterLink } from '../AuthFooterLink';
import { FormError } from '../FormError';
import type { SignInFormProps } from './types';

/** Email + password form; the submit button unlocks once both are valid. */
export function SignInForm({
  onSubmit,
  onForgotPassword,
  onCreateAccount,
  submitting = false,
  style,
}: SignInFormProps) {
  const { t } = useTranslation();
  const errorText = useFieldErrorText();
  const {
    control,
    setError,
    filled,
    submitWith,
    changeHandler,
    formState: { submitCount, errors },
  } = useSubmitForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    // Empty unless a dev build has a test account in .env.local.
    defaultValues: { ...CONFIG.DEV_SIGN_IN },
  });

  const submit = submitWith((values) => onSubmit(values, setError));

  return (
    <View style={style}>
      <Controller
        control={control}
        name="login"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <TextInput
            variant="inverse"
            error={errorText(fieldState.error)}
            shakeKey={submitCount}
            accessibilityLabel={t('auth.emailPlaceholder')}
            placeholder={t('auth.emailPlaceholder')}
            value={value}
            onChangeText={changeHandler('login', onChange)}
            onBlur={onBlur}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="username"
            returnKeyType="next"
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <TextInput
            variant="inverse"
            error={errorText(fieldState.error)}
            shakeKey={submitCount}
            accessibilityLabel={t('auth.password')}
            placeholder={t('auth.password')}
            value={value}
            onChangeText={changeHandler('password', onChange)}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={submit}
            containerStyle={styles.password}
          />
        )}
      />
      <Pressable
        accessibilityRole="link"
        hitSlop={8}
        onPress={onForgotPassword}
        style={styles.forgot}
      >
        <Text variant="bodySSemibold" color="onBrand">
          {t('auth.forgotPassword')}
        </Text>
      </Pressable>
      <Button
        variant="brand"
        fullWidth
        text={t('auth.signIn')}
        disabled={!filled}
        loading={submitting}
        onPress={submit}
      />
      <FormError message={errorText(errors.root?.server)} />
      <AuthFooterLink
        text={t('auth.notRegistered')}
        linkText={t('auth.createAccount')}
        onPress={onCreateAccount}
      />
    </View>
  );
}

SignInForm.displayName = 'SignInForm';

const styles = StyleSheet.create((theme) => ({
  password: {
    marginTop: theme.spacing(3),
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(5),
  },
}));
