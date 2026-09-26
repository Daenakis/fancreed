import type { UseFormSetError } from 'react-hook-form';
import type { StyleProp, ViewStyle } from 'react-native';

import type { SignInFormValues } from '@/schemas';

export type SignInFormProps = {
  /**
   * Called with valid values. Use `setError` to show server errors on a
   * field ('login' | 'password') or under the button ('root.server').
   */
  onSubmit: (
    values: SignInFormValues,
    setError: UseFormSetError<SignInFormValues>,
  ) => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
  /** Shows a spinner on the submit button. Defaults to `false`. */
  submitting?: boolean;
  style?: StyleProp<ViewStyle>;
};
