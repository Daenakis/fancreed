import { zodResolver } from '@hookform/resolvers/zod';

import { useSubmitForm } from '@/hooks';

import { type ClubFormValues, clubSchema } from '@/schemas';

/**
 * State of the create-club form. The screen owns it so the submit button
 * can live in the pinned footer; ClubForm renders the fields.
 */
export function useClubForm() {
  return useSubmitForm<ClubFormValues>({
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
}

export type ClubFormState = ReturnType<typeof useClubForm>;
