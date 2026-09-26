import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';
import { AccessibilityInfo } from 'react-native';

import { newsApi } from '@/api';

import type { NewsListResponse, NewsPost } from '@/types/api';

import { NewsBlock } from '@/features/home';

const post = (id: number): NewsPost => ({
  id,
  slug: `post-${id}`,
  title: `Title ${id}`,
  description: `Body ${id}`,
  image: `https://x/${id}.png`,
  category_title: 'News',
  created_at: '2026-09-26T12:00:00Z',
});

const response = (posts: NewsPost[]): NewsListResponse => ({
  data: posts,
  meta: { current_page: 1, last_page: 1, total: posts.length },
});

beforeEach(() => {
  jest
    .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
    .mockResolvedValue(false);
});

describe('NewsBlock', () => {
  it('loads the latest posts and shows them as cards', async () => {
    const list = jest
      .spyOn(newsApi, 'list')
      .mockResolvedValue(apiOk(response([post(1), post(2)])));
    const { findByText } = render(
      <NewsBlock onOpenPost={jest.fn()} count={5} />,
    );

    expect(await findByText('Title 1')).toBeTruthy();
    expect(list).toHaveBeenCalledWith({ page: 1, number: 5 });
  });

  it('opens the pressed post', async () => {
    jest.spyOn(newsApi, 'list').mockResolvedValue(apiOk(response([post(1)])));
    const onOpenPost = jest.fn();
    const { findByRole } = render(<NewsBlock onOpenPost={onOpenPost} />);

    fireEvent.press(await findByRole('button', { name: 'Title 1' }));

    expect(onOpenPost).toHaveBeenCalledWith(post(1));
  });

  it('renders nothing when there are no posts', async () => {
    jest.spyOn(newsApi, 'list').mockResolvedValue(apiOk(response([])));
    const { toJSON } = render(<NewsBlock onOpenPost={jest.fn()} />);

    await waitFor(() => expect(toJSON()).toBeNull());
  });
});
