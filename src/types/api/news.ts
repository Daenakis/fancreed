// Backend group "news" (`GET news/list?page&number`, `GET news/one/:slug`),
// read from the club site (asse.fr) by the backend.

export type NewsPost = {
  id: number;
  /** Path of the article on the club site (e.g. `…-ac40836`). */
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

/** `GET news/one/:slug` — one article with its text. */
export type NewsPostBody = {
  slug: string;
  title: string;
  /** The lead paragraph; empty for video posts. */
  description: string;
  image: string;
  /** Article text as HTML; empty for video posts. */
  body: string;
  /** YouTube link of a video post (ASSE.TV), otherwise null. */
  video: string | null;
};
