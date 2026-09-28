import { mutationOptions, useMutation } from '@tanstack/react-query';

import { feedbackApi, fetcher } from '@/api';

import { QueryKey } from '@/types';
import type { SendFeedbackRequest } from '@/types/api';

export const sendFeedbackMutationOptions = () =>
  mutationOptions({
    mutationKey: [QueryKey.Feedback, 'send'],
    mutationFn: (params: SendFeedbackRequest) =>
      fetcher(feedbackApi.send(params)),
  });

/** Sends a question, complaint or suggestion to the club managers. */
export function useSendFeedbackMutation() {
  return useMutation(sendFeedbackMutationOptions());
}
