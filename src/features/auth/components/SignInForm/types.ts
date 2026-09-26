import type { StyleProp, ViewStyle } from 'react-native';

import type { SignInFormValues } from '@/schemas';

export type SignInFormProps = {
  /** Called with trimmed values once both fields are filled. */
  onSubmit: (values: SignInFormValues) => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
  /** Shows a spinner on the submit button. Defaults to `false`. */
  submitting?: boolean;
  style?: StyleProp<ViewStyle>;
};
