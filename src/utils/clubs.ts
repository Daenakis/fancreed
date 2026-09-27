import type { ClubLogoUpload, CreateClubRequest } from '@/types/api';

import type { ClubFormValues } from '@/schemas';

/**
 * Club form values → `POST clubs/create` body. Empty links are left out.
 * The logo goes separately via `clubs/:id/setphoto` after creating.
 */
export function toCreateClubRequest(
  values: ClubFormValues,
  logo?: ClubLogoUpload,
): CreateClubRequest {
  return {
    name: values.name,
    opened: values.visibility === 'open',
    visible: true,
    description: values.description,
    address: values.address,
    facebook: values.facebook || undefined,
    instagram: values.instagram || undefined,
    telegram: values.telegram || undefined,
    logo,
  };
}
