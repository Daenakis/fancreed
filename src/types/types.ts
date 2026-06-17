import { STORAGE_KEYS } from '@/constants';

// Shared app-level types (non-API, non-enum)
// Example:
//
// export interface User {
//   id: string;
//   name: string;
//   email: string;
// }

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export type ThemeName = 'light' | 'dark';
