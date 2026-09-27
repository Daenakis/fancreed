import type { Profile } from '@/types/api';

export type ProfileFormProps = {
  profile: Profile;
};

export type DateFieldProps = {
  label: string;
  value: Date | undefined;
  error?: string;
  shakeKey?: number;
  onChange: (date: Date) => void;
};
