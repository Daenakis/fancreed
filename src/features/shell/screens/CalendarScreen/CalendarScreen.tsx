import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/ui/components';

/** Placeholder until the Calendar tab has a design. */
export function CalendarScreen() {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon="calendar"
      title={`${t('nav.calendar')} — ${t('nav.comingSoon')}`}
      text={t('nav.comingSoonText')}
    />
  );
}
