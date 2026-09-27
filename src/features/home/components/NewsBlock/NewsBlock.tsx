import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  Button,
  Carousel,
  ImageCard,
  LoadingMore,
  SectionTitle,
} from '@/ui/components';

import { useNewsQuery } from '@/hooks';

import type { NewsBlockProps } from './types';

/**
 * Home-screen news: "Latest news" title, swipeable article cards and an
 * "All news" button. Hidden when there are no posts.
 */
export function NewsBlock({
  onOpenPost,
  onShowAll,
  title,
  excludeSlug,
  count = 10,
  style,
}: NewsBlockProps) {
  const { t } = useTranslation();
  const { data, isPending } = useNewsQuery(count);
  const posts = data?.filter((post) => post.slug !== excludeSlug);

  if (isPending) return <LoadingMore loading />;
  if (!posts?.length) return null;

  return (
    <View style={style}>
      <SectionTitle title={title ?? t('home.newsTitle')} />
      <Carousel
        data={posts}
        itemWidthRatio={0.9}
        keyExtractor={(post) => String(post.id)}
        renderItem={(post) => (
          <ImageCard
            variant="article"
            image={post.image}
            title={post.title}
            description={post.description}
            onPress={() => onOpenPost(post)}
          />
        )}
      />
      <Button
        text={t('home.allNews')}
        backgroundColor="brand"
        textColor="onBrand"
        size="xs"
        fullWidth
        onPress={onShowAll}
        style={styles.all}
      />
    </View>
  );
}

NewsBlock.displayName = 'NewsBlock';

const styles = StyleSheet.create((theme) => ({
  all: {
    marginTop: theme.spacing(4),
    marginHorizontal: theme.spacing(5),
  },
}));
