import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import type { ParseKeys } from 'i18next';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  Button,
  ChoiceGroup,
  DateField,
  PageLayout,
  Select,
  Text,
  TextInput,
  TimeField,
} from '@/ui/components';

import {
  useCreateClubEventMutation,
  useFixturesTableQuery,
  useSubmitForm,
} from '@/hooks';

import { goBack, matchPhase } from '@/utils';

import { getApiErrorMessageKey } from '@/api';

import {
  type ClubEventFormInput,
  type ClubEventFormValues,
  clubEventSchema,
} from '@/schemas';

const EVENT_HOURS = 2;

/**
 * Create a club event (Figma, plus date and optional match): type, description,
 * address, date and time, access. "Create" unlocks once all required fields are
 * filled; the address is geocoded into the event's location.
 */
export function CreateClubEventScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: fixtures } = useFixturesTableQuery();
  const createEvent = useCreateClubEventMutation();
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    filled,
    submitWith,
    changeHandler,
    formState: { submitCount },
  } = useSubmitForm<ClubEventFormInput, ClubEventFormValues>({
    resolver: zodResolver(clubEventSchema),
    requiredFields: ['description', 'address', 'date', 'time'],
    defaultValues: {
      kind: 'party',
      description: '',
      address: '',
      date: undefined,
      time: undefined,
      fixture: 0,
      visibility: 'open',
    },
  });
  const errorText = (message?: string) =>
    message ? t(message as ParseKeys) : undefined;

  const upcoming = (fixtures?.future ?? []).filter(
    (m) => matchPhase(m.status) !== 'finished',
  );
  const day = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'long',
  });

  const save = (values: ClubEventFormValues) => {
    setError(null);
    const [hours, minutes] = values.time.split(':').map(Number);
    const start = new Date(values.date);
    start.setHours(hours ?? 0, minutes ?? 0, 0, 0);
    const startDate = Math.floor(start.getTime() / 1000);
    createEvent.mutate(
      {
        clubId: id,
        address: values.address,
        event: {
          type: 'club',
          kind: values.kind,
          // The form has no title field: the localised kind names the event.
          title: t(`events.kind.${values.kind}`),
          description: values.description,
          startDate,
          endDate: startDate + EVENT_HOURS * 3600,
          opened: values.visibility === 'open',
          visible: true,
          fixture: values.fixture || undefined,
        },
      },
      {
        onSuccess: (event) =>
          router.replace({
            pathname: '/gamification/clubs/[id]/events/[eventId]',
            params: { id, eventId: event._id },
          }),
        onError: (e) => setError(t(getApiErrorMessageKey(e))),
      },
    );
  };

  return (
    <PageLayout
      title={t('event.title')}
      onBack={goBack}
      contentStyle={styles.content}
      footer={
        <>
          <Button
            fullWidth
            backgroundColor="brand"
            textColor="onBrand"
            text={t('event.create')}
            disabled={!filled}
            loading={createEvent.isPending}
            onPress={submitWith(save)}
          />
          {error ? (
            <Text
              variant="bodySRegular"
              color="destructive"
              style={styles.error}
            >
              {error}
            </Text>
          ) : null}
        </>
      }
    >
      <Controller
        control={control}
        name="kind"
        render={({ field: { value, onChange } }) => (
          <View style={styles.field}>
            <Text variant="bodyMRegular">{t('event.kind')}</Text>
            <ChoiceGroup
              variant="chips"
              value={value}
              onChange={onChange}
              options={[
                {
                  label: t('events.kind.party'),
                  value: 'party',
                  icon: 'party',
                },
                { label: t('events.kind.trip'), value: 'trip', icon: 'bus' },
                {
                  label: t('events.kind.meeting'),
                  value: 'meeting',
                  icon: 'calendar',
                },
              ]}
            />
          </View>
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <TextInput
            label={`${t('event.description')}*`}
            placeholder={t('event.descriptionPlaceholder')}
            value={value}
            onChangeText={changeHandler('description', onChange)}
            onBlur={onBlur}
            multiline
            error={errorText(fieldState.error?.message)}
            shakeKey={submitCount}
          />
        )}
      />
      <Controller
        control={control}
        name="address"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <TextInput
            label={`${t('event.address')}*`}
            placeholder={t('event.address')}
            value={value}
            onChangeText={changeHandler('address', onChange)}
            onBlur={onBlur}
            error={errorText(fieldState.error?.message)}
            shakeKey={submitCount}
          />
        )}
      />
      <Controller
        control={control}
        name="date"
        render={({ field: { value, onChange }, fieldState }) => (
          <DateField
            label={`${t('event.date')}*`}
            value={value}
            minDate={new Date()}
            onChange={changeHandler<Date>('date', onChange)}
            error={errorText(fieldState.error?.message)}
            shakeKey={submitCount}
          />
        )}
      />
      <Controller
        control={control}
        name="time"
        render={({ field: { value, onChange }, fieldState }) => (
          <TimeField
            label={`${t('event.time')}*`}
            sheetTitle={t('event.pickTime')}
            value={value}
            onChange={changeHandler<string>('time', onChange)}
            error={errorText(fieldState.error?.message)}
            shakeKey={submitCount}
          />
        )}
      />
      <Controller
        control={control}
        name="fixture"
        render={({ field: { value, onChange } }) => (
          <View style={styles.field}>
            <Text variant="bodyMRegular">{t('event.match')}</Text>
            <Select
              label={t('event.match')}
              value={value}
              onChange={onChange}
              options={[
                { label: t('event.noMatch'), value: 0 },
                ...upcoming.map((m) => ({
                  label: `${m.homeTeam.name} – ${m.awayTeam.name}, ${day.format(new Date(m.event_date))}`,
                  value: m._id,
                })),
              ]}
            />
          </View>
        )}
      />
      <Controller
        control={control}
        name="visibility"
        render={({ field: { value, onChange } }) => (
          <View style={styles.field}>
            <Text variant="bodyMRegular">{t('event.visibility')}</Text>
            <ChoiceGroup
              value={value}
              onChange={onChange}
              options={[
                { label: t('club.open'), value: 'open' },
                { label: t('club.friends'), value: 'friends' },
              ]}
            />
          </View>
        )}
      />
    </PageLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing(4),
    paddingHorizontal: theme.spacing(4),
  },
  field: {
    gap: theme.spacing(2),
  },
  error: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
}));
