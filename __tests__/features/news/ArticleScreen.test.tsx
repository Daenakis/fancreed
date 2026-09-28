import { apiOk, fireEvent, render } from '@tests/test-utils';
import { useLocalSearchParams } from 'expo-router';
import { Linking } from 'react-native';

import { newsApi, socialsApi, sponsorsApi } from '@/api';

import type { NewsPost, NewsPostBody } from '@/types/api';

import { ArticleScreen } from '@/features/news';

const post: NewsPost = {
  id: 40836,
  slug: 'new-signing-ac40836',
  title: 'Les Vertes sign a defender',
  description: 'A defender from Lille.',
  image: 'https://www.asse.fr/img/content/2026/07/a.jpg',
  category_title: 'Official statement',
  created_at: '2026-07-12T18:00:00+02:00',
};

const article = (patch: Partial<NewsPostBody> = {}): NewsPostBody => ({
  slug: post.slug,
  title: post.title,
  description: post.description,
  image: post.image,
  body: '<p>Born in Calais, she joined Lille in 2021.</p>',
  video: null,
  ...patch,
});

const open = (slug: string, body: NewsPostBody, posts = [post]) => {
  jest.mocked(useLocalSearchParams).mockReturnValue({ slug });
  jest.spyOn(newsApi, 'list').mockResolvedValue(
    apiOk({
      data: posts,
      meta: { current_page: 1, last_page: 1, total: posts.length },
    }),
  );
  jest.spyOn(newsApi, 'body').mockResolvedValue(apiOk(body));
  jest.spyOn(socialsApi, 'list').mockResolvedValue(apiOk({ socials: [] }));
  jest.spyOn(sponsorsApi, 'list').mockResolvedValue(apiOk({ sponsors: [] }));
  return render(<ArticleScreen />);
};

describe('ArticleScreen', () => {
  it('shows the article text from the club site', async () => {
    const { findByText, getAllByText } = open(post.slug, article());

    expect(
      await findByText('Born in Calais, she joined Lille in 2021.'),
    ).toBeTruthy();
    expect(getAllByText(post.title).length).toBeGreaterThan(0);
    expect(newsApi.body).toHaveBeenCalledWith(post.slug);
  });

  it('offers the video of a video post', async () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    const video = 'https://www.youtube.com/watch?v=U7s2N9qDFD0';
    const { findByRole } = open(
      post.slug,
      article({ body: '', description: '', video }),
    );

    fireEvent.press(await findByRole('button', { name: 'article.watchVideo' }));

    expect(openURL).toHaveBeenCalledWith(video);
  });

  it('opens a post that is not in the latest news list', async () => {
    const { findByRole } = open(
      'older-post-ac100',
      article({ slug: 'older-post-ac100', title: 'An older story' }),
      [],
    );

    expect(await findByRole('header', { name: 'An older story' })).toBeTruthy();
  });
});
