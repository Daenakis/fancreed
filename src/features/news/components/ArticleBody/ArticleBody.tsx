import { Image, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import { htmlToBlocks } from '@/utils';

import type { ArticleBodyProps } from './types';

/** Article text rendered natively: paragraphs, headings and pictures. */
export function ArticleBody({ html, style }: ArticleBodyProps) {
  return (
    <View style={[styles.body, style]}>
      {htmlToBlocks(html).map((block, i) =>
        block.type === 'image' ? (
          <Image
            key={i}
            source={{ uri: block.uri }}
            resizeMode="cover"
            style={styles.image}
          />
        ) : (
          <Text
            key={i}
            variant={block.type === 'heading' ? 'h4Medium' : 'bodyMRegular'}
            accessibilityRole={block.type === 'heading' ? 'header' : undefined}
          >
            {block.text}
          </Text>
        ),
      )}
    </View>
  );
}

ArticleBody.displayName = 'ArticleBody';

const styles = StyleSheet.create((theme) => ({
  body: {
    gap: theme.spacing(3),
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.muted,
  },
}));
