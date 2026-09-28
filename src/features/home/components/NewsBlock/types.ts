import type { StyleProp, ViewStyle } from 'react-native';

import type { NewsPost } from '@/types/api';

export type NewsBlockProps = {
  /** Opens a post, e.g. `${CONFIG.LINKS.NEWS_POST}${post.slug}` in a browser. */
  onOpenPost: (post: NewsPost) => void;
  /** Opens the full news list. */
  onShowAll: () => void;
  /** Section title. Defaults to "Latest news". */
  title?: string;
  /** Leaves this post out, e.g. the article being read. */
  excludeSlug?: string;
  /** How many latest posts to show. Defaults to 10. */
  count?: number;
  /** Cards move on by themselves every 10 s, looping. Defaults to `false`. */
  autoPlay?: boolean;
  style?: StyleProp<ViewStyle>;
};
