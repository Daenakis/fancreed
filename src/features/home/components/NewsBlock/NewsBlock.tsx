import { View } from 'react-native';

import { ImageCard, LoadingMore, SlideshowList } from '@/ui/components';

import { useNewsQuery } from '@/hooks';

import type { NewsBlockProps } from './types';

/** Article card width (ImageCard `article`) — used for scroll positions. */
const CARD_WIDTH = 280;

/**
 * Home-screen news: latest posts as a self-advancing row of article cards.
 * Hidden when there are no posts.
 */
export function NewsBlock({ onOpenPost, count = 10, style }: NewsBlockProps) {
  const { data: posts, isPending } = useNewsQuery(count);

  if (isPending) return <LoadingMore loading />;
  if (!posts?.length) return null;

  return (
    <View style={style}>
      <SlideshowList
        data={posts}
        keyExtractor={(post) => String(post.id)}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <ImageCard
            variant="article"
            image={item.image}
            title={item.title}
            description={item.description}
            onPress={() => onOpenPost(item)}
          />
        )}
      />
    </View>
  );
}

NewsBlock.displayName = 'NewsBlock';
