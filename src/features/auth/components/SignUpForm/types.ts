import type { StyleProp, ViewStyle } from 'react-native';

import type { SignUpFormValues } from '@/schemas';

export type SignUpFormProps = {
  /** Called with trimmed values once all fields are filled. */
  onSubmit: (values: SignUpFormValues) => void;
  /** "Already have an account? Sign in" link. */
  onSignIn: () => void;
  /** Shows a spinner on the submit button. Defaults to `false`. */
  submitting?: boolean;
  style?: StyleProp<ViewStyle>;
};
