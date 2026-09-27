import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';

import { BottomSheet, Button, ChoiceGroup } from '@/ui/components';

import type { ReminderSheetProps } from './types';

/** Minutes before the event, with their i18n keys. */
const OPTIONS = [
  { minutes: 10, key: 'reminder.min10' },
  { minutes: 15, key: 'reminder.min15' },
  { minutes: 60, key: 'reminder.hour1' },
  { minutes: 120, key: 'reminder.hours2' },
  { minutes: 360, key: 'reminder.hours6' },
  { minutes: 1440, key: 'reminder.day1' },
] as const;

/**
 * "Set a reminder": pick how long before the event, then confirm — the
 * button says when the alert will fire ("today at 17:45").
 */
export function ReminderSheet({
  visible,
  onClose,
  start,
  onConfirm,
}: ReminderSheetProps) {
  const { t, i18n } = useTranslation();
  const [minutes, setMinutes] = useState(15);
  const at = new Date(start.getTime() - minutes * 60 * 1000);
  const now = new Date();
  const time = new Intl.DateTimeFormat(i18n.language, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(at);
  const today = at.toDateString() === now.toDateString();
  const day = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'long',
  }).format(at);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={t('reminder.title')}
    >
      <ChoiceGroup
        variant="list"
        value={minutes}
        onChange={setMinutes}
        options={OPTIONS.map((o) => ({ label: t(o.key), value: o.minutes }))}
      />
      <Button
        fullWidth
        size="xs"
        backgroundColor="brand"
        textColor="onBrand"
        text={
          today
            ? t('reminder.confirmToday', { time })
            : t('reminder.confirmOn', { day, time })
        }
        // An alert in the past would never fire.
        disabled={at <= now}
        onPress={() => onConfirm(minutes)}
        style={styles.button}
      />
    </BottomSheet>
  );
}

ReminderSheet.displayName = 'ReminderSheet';

const styles = StyleSheet.create((theme) => ({
  button: {
    marginTop: theme.spacing(2),
  },
}));
