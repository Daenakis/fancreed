import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/ui/components';

/** Placeholder until the Shop tab has a design. */
export function ShopScreen() {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon="shop"
      title={`${t('nav.shop')} — ${t('nav.comingSoon')}`}
      text={t('nav.comingSoonText')}
    />
  );
}
