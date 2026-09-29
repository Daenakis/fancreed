import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Linking, Share, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import {
  Button,
  EmptyState,
  LoadingMore,
  PageLayout,
  RemoteImage,
  Skeleton,
  SocialLinks,
  Text,
} from '@/ui/components';

import { useNewsPostBodyQuery, useNewsQuery, useSocialsQuery } from '@/hooks';

import { goBack } from '@/utils';

import { CONFIG } from '@/config';

import { NewsBlock, PartnersBlock } from '@/features/home';

import { ArticleBody } from '../../components';

// TODO: open links in an in-app browser once one is approved (expo-web-browser).
const openLink = (url: string) => void Linking.openURL(url);

/**
 * One news article: cover, title, date and the text (or a "Watch video"
 * button for video posts), then similar news, partners and the club's links.
 * The head comes from the news list cache when the post is there, otherwise
 * from the article itself (older posts, shared links).
 */
export function ArticleScreen() {
  const { t, i18n } = useTranslation();
  const { theme } = useUnistyles();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: posts, isPending } = useNewsQuery();
  const { data: article, isPending: articlePending } =
    useNewsPostBodyQuery(slug);
  const { data: socials } = useSocialsQuery();
  const listed = posts?.find((p) => p.slug === slug);
  const head = listed ?? article;
  const url = `${CONFIG.LINKS.NEWS_POST}${slug}`;

  return (
    <PageLayout
      title={t('article.title')}
      onBack={goBack}
      onShare={head ? () => void Share.share({ message: url }) : undefined}
      contentStyle={styles.content}
    >
      {isPending || (!listed && articlePending) ? (
        // The header in the article's shape; the body loads under it.
        <View style={styles.head}>
          <Skeleton height={COVER_HEIGHT} radius="md" />
          <Skeleton width="90%" height={theme.spacing(5)} />
          <Skeleton width="60%" height={theme.spacing(5)} />
        </View>
      ) : !head ? (
        <EmptyState
          icon="news"
          title={t('lineup.emptyTitle')}
          text={t('article.notFound')}
        />
      ) : (
        <>
          <View style={styles.head}>
            <RemoteImage
              source={{ uri: head.image }}
              resizeMode="cover"
              position="top"
              style={styles.cover}
            />
            <Text variant="h4Medium" accessibilityRole="header">
              {head.title}
            </Text>
            {listed?.created_at ? (
              <Text variant="bodySRegular" color="mutedForeground">
                {new Intl.DateTimeFormat(i18n.language, {
                  dateStyle: 'long',
                }).format(new Date(listed.created_at))}
              </Text>
            ) : null}
          </View>
          {!article ? (
            <LoadingMore loading={articlePending} />
          ) : (
            <>
              {article.body ? (
                <ArticleBody html={article.body} style={styles.inset} />
              ) : article.description ? (
                <Text variant="bodyLRegular" style={styles.inset}>
                  {article.description}
                </Text>
              ) : null}
              {article.video ? (
                <Button
                  size="md"
                  icon="play"
                  backgroundColor="brand"
                  textColor="onBrand"
                  text={t('article.watchVideo')}
                  onPress={() => openLink(article.video!)}
                  style={styles.inset}
                />
              ) : null}
            </>
          )}
          <NewsBlock
            title={t('article.similar')}
            excludeSlug={slug}
            onOpenPost={(next) =>
              router.push({
                pathname: '/news/[slug]',
                params: { slug: next.slug },
              })
            }
            onShowAll={() => openLink(CONFIG.LINKS.NEWS_POST)}
          />
          <PartnersBlock onOpenPartner={(partner) => openLink(partner.url)} />
          <SocialLinks
            title={t('home.linksTitle')}
            links={socials ?? []}
            onOpen={(link) => openLink(link.url)}
          />
        </>
      )}
    </PageLayout>
  );
}

const COVER_HEIGHT = 200;

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing(6),
    paddingBottom: 0,
  },
  head: {
    marginHorizontal: theme.spacing(4),
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.secondary,
  },
  cover: {
    width: '100%',
    height: COVER_HEIGHT,
    borderRadius: theme.radius.md,
  },
  inset: {
    marginHorizontal: theme.spacing(4),
  },
}));
