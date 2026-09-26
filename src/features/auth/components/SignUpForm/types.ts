import type { UseFormSetError } from 'react-hook-form';
import type { StyleProp, ViewStyle } from 'react-native';

import type { SignUpFormInput, SignUpFormValues } from '@/schemas';

export type SignUpFormProps = {
  /**
   * Called with valid, normalised values. Use `setError` to show server
   * errors on a field or under the button ('root.server').
   */
  onSubmit: (
    values: SignUpFormValues,
    setError: UseFormSetError<SignUpFormInput>,
  ) => void;
  /** "Already have an account? Sign in" link. */
  onSignIn: () => void;
  /** Shows a spinner on the submit button. Defaults to `false`. */
  submitting?: boolean;
  style?: StyleProp<ViewStyle>;
};
