import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  Button,
  ChoiceGroup,
  DateField,
  EmptyState,
  LoadingMore,
  Notice,
  PageLayout,
  Text,
  TextInput,
} from '@/ui/components';

import {
  useEditProfileMutation,
  useFieldErrorText,
  useProfileQuery,
  useSubmitForm,
} from '@/hooks';

import { goBack } from '@/utils';

import { getApiErrorMessageKey } from '@/api';

import {
  type ProfileFormInput,
  type ProfileFormValues,
  profileSchema,
} from '@/schemas';

import type { ProfileFormProps } from './types';

// Most fans are adults — open the birthday calendar around 2000, not today.
const BIRTHDAY_VIEW = new Date(2000, 0, 1);

/** Edit profile: name, patronymic, birthday and sex; email is read-only. */
export function EditProfileScreen() {
  const { t } = useTranslation();
  const { data: profile, isPending } = useProfileQuery();

  return (
    <PageLayout
      title={t('profile.editTitle')}
      onBack={goBack}
      contentStyle={styles.content}
    >
      {isPending ? (
        <LoadingMore loading />
      ) : profile ? (
        <ProfileForm profile={profile} />
      ) : (
        <EmptyState
          icon="user"
          title={t('lineup.emptyTitle')}
          text={t('profile.loadFailed')}
        />
      )}
    </PageLayout>
  );
}

function ProfileForm({ profile }: ProfileFormProps) {
  const { t } = useTranslation();
  const errorText = useFieldErrorText();
  const editProfile = useEditProfileMutation();
  const {
    control,
    setError,
    submitWith,
    changeHandler,
    filled,
    formState: { submitCount, errors },
  } = useSubmitForm<ProfileFormInput, ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    // Save unlocks once these are set; patronymic is optional.
    requiredFields: ['name', 'surname', 'birthDay', 'sex'],
    defaultValues: {
      name: profile.name ?? '',
      surname: profile.surname ?? '',
      patronymic: profile.patronymic ?? '',
      birthDay: profile.birthDay
        ? new Date(profile.birthDay * 1000)
        : undefined,
      sex: profile.sex === 'm' || profile.sex === 'f' ? profile.sex : undefined,
    },
  });

  const save = submitWith((values) =>
    editProfile.mutate(
      {
        name: values.name,
        surname: values.surname,
        patronymic: values.patronymic || undefined,
        sex: values.sex,
        birthDay: Math.floor(values.birthDay.getTime() / 1000),
      },
      {
        onSuccess: () => router.back(),
        onError: (error) =>
          setError('root.server', { message: getApiErrorMessageKey(error) }),
      },
    ),
  );

  const text = (
    name: 'name' | 'surname' | 'patronymic',
    label: string,
    autoComplete: 'given-name' | 'family-name' | 'additional-name',
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState }) => (
        <TextInput
          label={label}
          placeholder={label.replace(' *', '')}
          value={value}
          onChangeText={changeHandler(name, onChange)}
          onBlur={onBlur}
          error={errorText(fieldState.error)}
          shakeKey={submitCount}
          autoComplete={autoComplete}
          autoCapitalize="words"
        />
      )}
    />
  );

  return (
    <View style={styles.form}>
      <Notice text={t('profile.requiredNotice')} />
      {text('name', `${t('profile.name')} *`, 'given-name')}
      {text('surname', `${t('profile.surname')} *`, 'family-name')}
      {text('patronymic', t('profile.patronymic'), 'additional-name')}
      <Controller
        control={control}
        name="birthDay"
        render={({ field: { value, onChange }, fieldState }) => (
          <DateField
            label={`${t('profile.birthDay')} *`}
            value={value}
            error={errorText(fieldState.error)}
            shakeKey={submitCount}
            initialView={BIRTHDAY_VIEW}
            maxDate={new Date()}
            onChange={changeHandler<Date>('birthDay', onChange)}
          />
        )}
      />
      <Controller
        control={control}
        name="sex"
        render={({ field: { value, onChange }, fieldState }) => (
          <View style={styles.field}>
            <Text variant="bodyMRegular">{`${t('profile.sex')} *`}</Text>
            <ChoiceGroup
              options={[
                { label: t('profile.male'), value: 'm' as const },
                { label: t('profile.female'), value: 'f' as const },
              ]}
              value={value}
              onChange={changeHandler<'m' | 'f'>('sex', onChange)}
            />
            {fieldState.error ? (
              <Text variant="bodySRegular" color="destructive">
                {errorText(fieldState.error)}
              </Text>
            ) : null}
          </View>
        )}
      />
      <TextInput label={t('profile.email')} value={profile.email} disabled />
      <Button
        size="xs"
        fullWidth
        backgroundColor="brand"
        textColor="onBrand"
        text={t('common.save')}
        disabled={!filled}
        loading={editProfile.isPending}
        onPress={save}
      />
      {errors.root?.server ? (
        <Text variant="bodySRegular" color="destructive">
          {errorText(errors.root.server)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    paddingHorizontal: theme.spacing(4),
  },
  form: {
    gap: theme.spacing(3),
  },
  field: {
    gap: theme.spacing(2),
  },
}));
