import {
  type FieldValues,
  type Path,
  type SubmitHandler,
  useForm,
  type UseFormProps,
  useWatch,
} from 'react-hook-form';

/**
 * react-hook-form set up the way auth forms behave:
 * - errors appear only when the button is pressed (no validation while typing);
 * - editing a field removes its error (and the form-level server error)
 *   until the next press;
 * - `filled` — every text field has a value, used to unlock the button.
 */
export function useAuthForm<TInput extends FieldValues, TOutput = TInput>(
  options: Omit<
    UseFormProps<TInput, unknown, TOutput>,
    'mode' | 'reValidateMode'
  >,
) {
  const form = useForm<TInput, unknown, TOutput>({
    ...options,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });
  const values = useWatch({ control: form.control });
  const filled = Object.values(values ?? {}).every(
    (v) => typeof v !== 'string' || v.trim().length > 0,
  );

  /** Press handler: validates, then calls `onValid` with the parsed values. */
  const submitWith = (onValid: SubmitHandler<TOutput>) => () =>
    void form.handleSubmit(onValid)();

  /** Wraps a field's onChange so typing clears that field's error. */
  const changeHandler =
    (name: Path<TInput>, onChange: (text: string) => void) =>
    (text: string) => {
      if (form.getFieldState(name).error) form.clearErrors(name);
      if (form.formState.errors.root) form.clearErrors('root');
      onChange(text);
    };

  return { ...form, filled, submitWith, changeHandler };
}
