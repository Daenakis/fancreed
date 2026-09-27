import { zodResolver } from '@hookform/resolvers/zod';
import type { ParseKeys } from 'i18next';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  AddPhoto,
  Button,
  ChoiceGroup,
  Text,
  TextInput,
} from '@/ui/components';

import { useSubmitForm } from '@/hooks';

import { type ClubFormValues, clubSchema } from '@/schemas';

import type { ClubFormProps } from './types';

const TEXT_FIELDS = [
  { name: 'name', label: 'club.name' },
  { name: 'address', label: 'club.address' },
  { name: 'description', label: 'club.description', multiline: true },
  { name: 'facebook', label: 'club.facebook', link: true },
  { name: 'instagram', label: 'club.instagram', link: true },
  { name: 'telegram', label: 'club.telegram', link: true },
] as const;

/**
 * Create / edit a fan club: logo, name, who can join, address,
 * description and optional social links. Errors show when Save is pressed.
 */
export function ClubForm({
  onSubmit,
  photo,
  onPickPhoto,
  submitting = false,
  errorMessage,
  style,
}: ClubFormProps) {
  const { t } = useTranslation();
  const {
    control,
    filled,
    submitWith,
    changeHandler,
    formState: { submitCount },
  } = useSubmitForm<ClubFormValues>({
    resolver: zodResolver(clubSchema),
    // Social links are optional.
    requiredFields: ['name', 'address', 'description'],
    defaultValues: {
      name: '',
      visibility: 'open',
      address: '',
      description: '',
      facebook: '',
      instagram: '',
      telegram: '',
    },
  });

  return (
    <View style={[styles.container, style]}>
      <AddPhoto
        photo={photo}
        onPress={onPickPhoto ?? (() => {})}
        disabled={!onPickPhoto}
        style={styles.photo}
      />
      {TEXT_FIELDS.slice(0, 1).map((field) => (
        <Controller
          key={field.name}
          control={control}
          name={field.name}
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <TextInput
              label={t(field.label)}
              value={value}
              onChangeText={changeHandler(field.name, onChange)}
              onBlur={onBlur}
              error={
                fieldState.error && t(fieldState.error.message as ParseKeys)
              }
              shakeKey={submitCount}
            />
          )}
        />
      ))}
      <Controller
        control={control}
        name="visibility"
        render={({ field: { value, onChange } }) => (
          <ChoiceGroup
            caption={t('club.visibility')}
            value={value}
            onChange={onChange}
            options={[
              { label: t('club.open'), value: 'open' },
              { label: t('club.friends'), value: 'friends' },
            ]}
          />
        )}
      />
      {TEXT_FIELDS.slice(1).map((field) => (
        <Controller
          key={field.name}
          control={control}
          name={field.name}
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <TextInput
              label={t(field.label)}
              value={value}
              onChangeText={changeHandler(field.name, onChange)}
              onBlur={onBlur}
              multiline={'multiline' in field}
              autoCapitalize={'link' in field ? 'none' : 'sentences'}
              keyboardType={'link' in field ? 'url' : 'default'}
              placeholder={'link' in field ? 'https://' : undefined}
              error={
                fieldState.error && t(fieldState.error.message as ParseKeys)
              }
              shakeKey={submitCount}
            />
          )}
        />
      ))}
      <Button
        fullWidth
        text={t('club.save')}
        backgroundColor="primary"
        textColor="primaryForeground"
        loading={submitting}
        disabled={!filled}
        onPress={submitWith(onSubmit)}
      />
      {errorMessage ? (
        <Text color="destructive" style={styles.error}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}

ClubForm.displayName = 'ClubForm';

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing(4),
  },
  photo: {
    alignSelf: 'center',
  },
  error: {
    textAlign: 'center',
  },
}));
