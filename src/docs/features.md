# Features

Business features — screen logic, feature-specific components, and local hooks. Each feature is a self-contained module that assembles UI from global building blocks (`ui/components`, `hooks/query`, `store`, `api`).

Route files in `src/app/` stay thin — they only import and re-export screen components from here.

## Conventions

| Rule                                  | Description                                                         |
| ------------------------------------- | ------------------------------------------------------------------- |
| One feature = one folder              | `src/features/[name]/`                                              |
| Screens in `screens/` subfolder       | `screens/[Name]Screen/[Name]Screen.tsx`                             |
| Components in `components/` subfolder | `components/[Name]/[Name].tsx`                                      |
| Every component/screen is a folder    | Contains `.tsx`, `types.ts` (if needed), and `index.ts`             |
| Re-export from index                  | Every folder has an `index.ts` barrel file                          |
| Feature-local hooks allowed           | `hooks/` inside feature; move to `src/hooks/` when reused elsewhere |

## Types

| Scope                                | Location                                          |
| ------------------------------------ | ------------------------------------------------- |
| Global (API contracts, shared enums) | `src/types/`                                      |
| Component props, local enums         | `types.ts` or `[Name].types.ts` next to component |
| Shared between feature components    | `features/[name]/types.ts`                        |

Single component in a folder — use `types.ts`. Multiple related components — either one `types.ts` for all, or `[Name].types.ts` per component. Both are valid.

## Folder Structure

```
src/features/
├── posts/
│   ├── screens/
│   │   ├── PostsScreen/
│   │   │   ├── PostsScreen.tsx
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── PostDetailScreen/
│   │   │   ├── PostDetailScreen.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── components/
│   │   ├── PostCard/
│   │   │   ├── PostCard.tsx
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── hooks/                  # (optional) feature-local hooks
│   │   ├── usePostFilters.ts
│   │   └── index.ts
│   ├── types.ts                # (optional) shared feature types
│   └── index.ts
└── ...
```

## Quick Example

Feature screen (`features/posts/screens/PostsScreen/PostsScreen.tsx`):

```tsx
import { FlatList } from 'react-native';

import { usePostsQuery } from '@/hooks/query';

import { PostCard } from '../../components';

export function PostsScreen() {
  const { data: posts } = usePostsQuery();

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard post={item} />}
    />
  );
}
```

Thin route file (`app/(app)/posts/index.tsx`):

```tsx
import { PostsScreen } from '@/features/posts';

export default PostsScreen;
```
