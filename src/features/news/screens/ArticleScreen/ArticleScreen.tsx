import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Linking, Share, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  EmptyState,
  LoadingMore,
  PageLayout,
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
 * One news article: cover, title, date and the text, then similar news,
 * partners and the club's links. The post comes from the news list cache.
 */
export function ArticleScreen() {
  const { t, i18n } = useTranslation();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: posts, isPending } = useNewsQuery();
  const { data: body } = useNewsPostBodyQuery(slug);
  const { data: socials } = useSocialsQuery();
  const post = posts?.find((p) => p.slug === slug);
  const url = `${CONFIG.LINKS.NEWS_POST}${slug}`;

  return (
    <PageLayout
      title={t('article.title')}
      onBack={goBack}
      onShare={post ? () => void Share.share({ message: url }) : undefined}
      contentStyle={styles.content}
    >
      {isPending ? (
        <LoadingMore loading />
      ) : !post ? (
        <EmptyState
          icon="news"
          title={t('lineup.emptyTitle')}
          text={t('article.notFound')}
        />
      ) : (
        <>
          <View style={styles.head}>
            <Image
              source={{ uri: post.image }}
              resizeMode="cover"
              style={styles.cover}
            />
            <Text variant="h4Medium" accessibilityRole="header">
              {post.title}
            </Text>
            <Text variant="bodySRegular" color="mutedForeground">
              {new Intl.DateTimeFormat(i18n.language, {
                dateStyle: 'long',
              }).format(new Date(post.created_at))}
            </Text>
          </View>
          {body ? (
            <ArticleBody html={body} style={styles.inset} />
          ) : (
            <LoadingMore loading />
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
    height: 200,
    borderRadius: theme.radius.md,
  },
  inset: {
    marginHorizontal: theme.spacing(4),
  },
}));
