import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text, TextInput } from '@/ui/components';

import { type SignInFormValues, signInSchema } from '@/schemas';

import { AuthButton } from '../AuthButton';
import type { SignInFormProps } from './types';

/** Login + password form; the submit button unlocks once both are filled. */
export function SignInForm({
  onSubmit,
  onForgotPassword,
  onCreateAccount,
  submitting = false,
  style,
}: SignInFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: { login: '', password: '' },
  });

  return (
    <View style={style}>
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
            autoComplete="username"
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
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            variant="inverse"
            accessibilityLabel={t('auth.password')}
            placeholder={t('auth.password')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
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
      <AuthButton
        title={t('auth.signIn')}
        disabled={!isValid}
        loading={submitting}
        onPress={handleSubmit(onSubmit)}
      />
      <View style={styles.register}>
        <Text variant="bodySRegular" color="onBrand">
          {t('auth.notRegistered')}
        </Text>
        <Pressable
          accessibilityRole="link"
          hitSlop={8}
          onPress={onCreateAccount}
        >
          <Text variant="bodySSemibold" color="onBrand">
            {t('auth.createAccount')}
          </Text>
        </Pressable>
      </View>
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
  register: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
}));
