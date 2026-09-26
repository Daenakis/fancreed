import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button, TextInput } from '@/ui/components';

import {
  type SignUpFormInput,
  type SignUpFormValues,
  signUpSchema,
} from '@/schemas';

import { useAuthForm, useFieldErrorText } from '../../hooks';
import { AuthFooterLink } from '../AuthFooterLink';
import { FormError } from '../FormError';
import type { SignUpFormProps } from './types';

/** Name + email + password form; submit unlocks once all are valid. */
export function SignUpForm({
  onSubmit,
  onSignIn,
  submitting = false,
  style,
}: SignUpFormProps) {
  const { t } = useTranslation();
  const errorText = useFieldErrorText();
  const {
    control,
    setError,
    filled,
    submitWith,
    changeHandler,
    formState: { submitCount, errors },
  } = useAuthForm<SignUpFormInput, SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const submit = submitWith((values) => onSubmit(values, setError));

  return (
    <View style={style}>
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <TextInput
            variant="inverse"
            error={errorText(fieldState.error)}
            shakeKey={submitCount}
            accessibilityLabel={t('auth.namePlaceholder')}
            placeholder={t('auth.namePlaceholder')}
            value={value}
            onChangeText={changeHandler('name', onChange)}
            onBlur={onBlur}
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <TextInput
            variant="inverse"
            error={errorText(fieldState.error)}
            shakeKey={submitCount}
            accessibilityLabel={t('auth.emailPlaceholder')}
            placeholder={t('auth.emailPlaceholder')}
            value={value}
            onChangeText={changeHandler('email', onChange)}
            onBlur={onBlur}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="username"
            returnKeyType="next"
            containerStyle={styles.field}
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
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={submit}
            containerStyle={styles.field}
          />
        )}
      />
      <Button
        variant="brand"
        fullWidth
        text={t('auth.signUp')}
        disabled={!filled}
        loading={submitting}
        onPress={submit}
        style={styles.submit}
      />
      <FormError message={errorText(errors.root?.server)} />
      <AuthFooterLink
        text={t('auth.haveAccount')}
        linkText={t('auth.signIn')}
        onPress={onSignIn}
      />
    </View>
  );
}

SignUpForm.displayName = 'SignUpForm';

const styles = StyleSheet.create((theme) => ({
  field: {
    marginTop: theme.spacing(3),
  },
  submit: {
    marginTop: theme.spacing(6),
  },
}));
