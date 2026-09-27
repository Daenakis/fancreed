import {
  type FieldValues,
  type Path,
  type SubmitHandler,
  useForm,
  type UseFormProps,
  useWatch,
} from 'react-hook-form';

/**
 * react-hook-form set up the way the app's forms behave:
 * - errors appear only when the button is pressed (no validation while typing);
 * - editing a field removes its error (and the form-level server error)
 *   until the next press;
 * - `filled` — every text field (or every `requiredFields` entry) has a
 *   value, used to unlock the button.
 */
export function useSubmitForm<TInput extends FieldValues, TOutput = TInput>({
  requiredFields,
  ...options
}: Omit<UseFormProps<TInput, unknown, TOutput>, 'mode' | 'reValidateMode'> & {
  /** Fields that must be filled (text, a date, a choice) to unlock the button. Defaults to all. */
  requiredFields?: Path<TInput>[];
}) {
  const form = useForm<TInput, unknown, TOutput>({
    ...options,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });
  const values = useWatch({ control: form.control });
  const checked = requiredFields
    ? requiredFields.map((name) => (values as Record<string, unknown>)?.[name])
    : Object.values(values ?? {});
  const filled = checked.every((v) =>
    typeof v === 'string' ? v.trim().length > 0 : v !== undefined && v !== null,
  );

  /** Press handler: validates, then calls `onValid` with the parsed values. */
  const submitWith = (onValid: SubmitHandler<TOutput>) => () =>
    void form.handleSubmit(onValid)();

  /** Wraps a field's onChange so typing clears that field's error. */
  const changeHandler =
    <V = string>(name: Path<TInput>, onChange: (value: V) => void) =>
    (value: V) => {
      if (form.getFieldState(name).error) form.clearErrors(name);
      if (form.formState.errors.root) form.clearErrors('root');
      onChange(value);
    };

  return { ...form, filled, submitWith, changeHandler };
}
