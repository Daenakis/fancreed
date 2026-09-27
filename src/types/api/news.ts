// Backend group "news" (`GET news/list?page&number`), proxied from the club site.

export type NewsPost = {
  id: number;
  /** Path of the article on the club site. */
  slug: string;
  title: string;
  description: string;
  image: string;
  category_title: string;
  created_at: string;
};

export type NewsListParams = {
  /** 1-based page. */
  page: number;
  /** Posts per page. */
  number: number;
};

export type NewsListResponse = {
  data: NewsPost[];
  meta: { current_page: number; last_page: number; total: number };
};

/**
 * Full article text as HTML.
 * TODO(backend): no endpoint yet — mocked in `newsApi.body`.
 */
export type NewsPostBody = {
  slug: string;
  body: string;
};
