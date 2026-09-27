import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { SocialLinks } from '@/ui/components';

import { useSocialsQuery } from '@/hooks';

import { CONFIG } from '@/config';

import { PredictionBlock } from '@/features/gamification';

import {
  FanCardBlock,
  FanShopBanner,
  MatchesBlock,
  NewsBlock,
  PartnersBlock,
  SquadBlock,
  TableBlock,
} from '../../components';

// TODO: open links in an in-app browser once one is approved (expo-web-browser).
const openLink = (url: string) => void Linking.openURL(url);

/** Home tab: the club's matches, news, predictions, table, squad and links. */
export function HomeScreen() {
  const { t } = useTranslation();
  const { data: socials } = useSocialsQuery();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <MatchesBlock onOpenLink={openLink} />
      <NewsBlock
        onOpenPost={(post) => openLink(`${CONFIG.LINKS.NEWS_POST}${post.slug}`)}
        onShowAll={() => openLink(CONFIG.LINKS.NEWS_POST)}
      />
      <FanShopBanner onPress={() => router.navigate('/shop')} />
      <FanCardBlock />
      <PredictionBlock />
      {/* TODO: open the full table screen once it exists. */}
      <TableBlock onShowAll={() => {}} />
      <SquadBlock
        onOpenPlayer={(player) => player.ruhLink && openLink(player.ruhLink)}
      />
      <SocialLinks
        title={t('home.linksTitle')}
        links={socials ?? []}
        onOpen={(link) => openLink(link.url)}
      />
      <PartnersBlock onOpenPartner={(partner) => openLink(partner.url)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingVertical: theme.spacing(4),
    gap: theme.spacing(6),
  },
}));
