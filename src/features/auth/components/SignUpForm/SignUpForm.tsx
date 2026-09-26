import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { TextInput } from '@/ui/components';

import { type SignUpFormValues, signUpSchema } from '@/schemas';

import { AuthButton } from '../AuthButton';
import { AuthFooterLink } from '../AuthFooterLink';
import type { SignUpFormProps } from './types';

/** Name + login + password form; submit unlocks once all are filled. */
export function SignUpForm({
  onSubmit,
  onSignIn,
  submitting = false,
  style,
}: SignUpFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: { name: '', login: '', password: '' },
  });

  return (
    <View style={style}>
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            variant="inverse"
            accessibilityLabel={t('auth.namePlaceholder')}
            placeholder={t('auth.namePlaceholder')}
            value={value}
            onChangeText={onChange}
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
        name="login"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            variant="inverse"
            accessibilityLabel={t('auth.loginPlaceholder')}
            placeholder={t('auth.loginPlaceholder')}
            value={value}
            onChangeText={onChange}
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
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            variant="inverse"
            accessibilityLabel={t('auth.password')}
            placeholder={t('auth.password')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
            containerStyle={styles.field}
          />
        )}
      />
      <AuthButton
        title={t('auth.signUp')}
        disabled={!isValid}
        loading={submitting}
        onPress={handleSubmit(onSubmit)}
        style={styles.submit}
      />
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
