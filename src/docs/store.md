# Store

Zustand stores for client-side state (UI, auth, preferences). Server data lives in React Query, not here.

## Conventions

| Rule                 | Description                                       |
| -------------------- | ------------------------------------------------- |
| One store = one file | `use[Name]Store.ts`                               |
| Re-export from index | All stores go through `index.ts`                  |
| Always use selectors | `useStore((s) => s.field)`, never the whole store |
| Actions inside store | No separate action files                          |

## Quick Example

```ts
import { create } from 'zustand';

interface UIStore {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
```

Auth tokens use SecureStore via `@/utils/secureToken`. For other persistence with MMKV — see `useTheme`, `useLanguage`.

## Folder Structure

```
src/store/
├── index.ts
└── use[Name]Store.ts
```

## Multiple Fields with `useShallow`

When a component needs several fields from one store, use `useShallow` to avoid unnecessary re-renders. Without it, a new object reference is created on every render and Zustand treats it as a change.

```ts
import { useShallow } from 'zustand/shallow';

const { theme, setTheme } = useUIStore(
  useShallow((s) => ({ theme: s.theme, setTheme: s.setTheme })),
);
```

Single-field selectors (`useStore((s) => s.field)`) don't need `useShallow` — they already return stable primitives.

## Docs

- [Zustand v5](https://zustand.docs.pmnd.rs/)
- [Persist middleware](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)
- [useShallow](https://zustand.docs.pmnd.rs/guides/prevent-rerenders-with-use-shallow)
