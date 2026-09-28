import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button, PageLayout, Text, TextInput } from '@/ui/components';

import {
  useFieldErrorText,
  useProfileQuery,
  useSendFeedbackMutation,
  useSubmitForm,
} from '@/hooks';

import { goBack } from '@/utils';

import { getApiErrorMessageKey } from '@/api';

import {
  FEEDBACK_MESSAGE_MAX_LENGTH,
  type FeedbackFormInput,
  type FeedbackFormValues,
  feedbackSchema,
} from '@/schemas';

/**
 * Feedback (Figma "Зворотній зв'язок"): name, phone and a question,
 * complaint or suggestion for the club managers; "Send" pinned at the bottom
 * unlocks once all three are filled. Name and phone start from the profile.
 */
export function FeedbackScreen() {
  const { t } = useTranslation();
  const errorText = useFieldErrorText();
  const { data: profile } = useProfileQuery();
  const send = useSendFeedbackMutation();
  const {
    control,
    setError,
    submitWith,
    changeHandler,
    filled,
    formState: { submitCount, errors },
  } = useSubmitForm<FeedbackFormInput, FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: [profile?.name, profile?.surname].filter(Boolean).join(' '),
      phone: profile?.phone ?? '',
      message: '',
    },
  });

  const submit = submitWith((values) =>
    send.mutate(values, {
      onSuccess: () => {
        Alert.alert(t('feedback.sentTitle'), t('feedback.sentText'));
        goBack();
      },
      onError: (error) =>
        setError('root.server', { message: getApiErrorMessageKey(error) }),
    }),
  );

  return (
    <PageLayout
      title={t('feedback.title')}
      onBack={goBack}
      contentStyle={styles.content}
      footer={
        <Button
          size="xs"
          fullWidth
          backgroundColor="brand"
          textColor="onBrand"
          text={t('feedback.send')}
          disabled={!filled}
          loading={send.isPending}
          onPress={submit}
        />
      }
    >
      <Text variant="bodySRegular">{t('feedback.intro')}</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <TextInput
            placeholder={t('feedback.name')}
            accessibilityLabel={t('feedback.name')}
            value={value}
            onChangeText={changeHandler('name', onChange)}
            onBlur={onBlur}
            error={errorText(fieldState.error)}
            shakeKey={submitCount}
            autoComplete="name"
            autoCapitalize="words"
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <TextInput
            placeholder={t('feedback.phone')}
            accessibilityLabel={t('feedback.phone')}
            value={value}
            onChangeText={changeHandler('phone', onChange)}
            onBlur={onBlur}
            error={errorText(fieldState.error)}
            shakeKey={submitCount}
            autoComplete="tel"
            keyboardType="phone-pad"
          />
        )}
      />
      <Controller
        control={control}
        name="message"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <TextInput
            placeholder={t('feedback.message')}
            accessibilityLabel={t('feedback.message')}
            value={value}
            onChangeText={changeHandler('message', onChange)}
            onBlur={onBlur}
            error={errorText(fieldState.error)}
            shakeKey={submitCount}
            multiline
            maxLength={FEEDBACK_MESSAGE_MAX_LENGTH}
            style={styles.message}
          />
        )}
      />
      {errors.root?.server ? (
        <Text variant="bodySRegular" color="destructive">
          {errorText(errors.root.server)}
        </Text>
      ) : null}
    </PageLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing(3),
    paddingHorizontal: theme.spacing(4),
  },
  message: {
    minHeight: theme.spacing(15),
    textAlignVertical: 'top',
  },
}));
