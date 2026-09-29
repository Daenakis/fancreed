import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import {
  Button,
  Carousel,
  ImageCard,
  SectionTitle,
  Skeleton,
} from '@/ui/components';

import { useNewsQuery } from '@/hooks';

import type { NewsBlockProps } from './types';

/** Auto-play step of the news cards (Home). */
const AUTO_PLAY_MS = 10_000;

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
  autoPlay = false,
  style,
}: NewsBlockProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const { data, isPending } = useNewsQuery(count);
  const posts = data?.filter((post) => post.slug !== excludeSlug);

  if (isPending) {
    // One card's image and title, where the carousel's first card sits.
    return (
      <View style={style}>
        <SectionTitle title={title ?? t('home.newsTitle')} />
        <View style={styles.skeleton}>
          <Skeleton height={ARTICLE_IMAGE_HEIGHT} radius="md" />
          <Skeleton width="90%" height={theme.spacing(5)} />
          <Skeleton width="60%" height={theme.spacing(5)} />
        </View>
      </View>
    );
  }
  if (!posts?.length) return null;

  return (
    <View style={style}>
      <SectionTitle title={title ?? t('home.newsTitle')} />
      <Carousel
        data={posts}
        itemWidthRatio={0.9}
        autoPlayMs={autoPlay ? AUTO_PLAY_MS : undefined}
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

/** ImageCard `article` image height. */
const ARTICLE_IMAGE_HEIGHT = 180;

const styles = StyleSheet.create((theme) => ({
  skeleton: {
    width: '90%',
    alignSelf: 'center',
    gap: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.secondary,
  },
  all: {
    marginTop: theme.spacing(4),
    marginHorizontal: theme.spacing(5),
  },
}));
