import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { getApiErrorMessageKey } from '@/api';

/**
 * `onError` for one-tap actions (join, vote, predict) that have no form to
 * show the error in: a native alert with the translated backend message.
 */
export function useApiErrorAlert() {
  const { t } = useTranslation();
  return useCallback(
    (error: unknown) => Alert.alert(t(getApiErrorMessageKey(error))),
    [t],
  );
}
