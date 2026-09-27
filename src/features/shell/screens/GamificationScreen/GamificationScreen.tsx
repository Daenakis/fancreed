import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/ui/components';

/** Placeholder until the Gamification tab has a design. */
export function GamificationScreen() {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon="lion"
      title={`${t('nav.gamification')} — ${t('nav.comingSoon')}`}
      text={t('nav.comingSoonText')}
    />
  );
}
