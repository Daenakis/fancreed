import type { AxiosResponse } from 'axios';

import type * as T from '@/types/api';

import { axiosInstance } from '../client';

// TODO(backend): replace with the real article endpoint (the club site returns HTML).
const MOCK_BODY = [
  '<p><strong>Півзахисник «Руху» розповів про адаптацію у Львові, підготовку до сезону та цілі команди.</strong></p>',
  '<p>&laquo;Тут неймовірна атмосфера &ndash; вболівальники підтримують нас на кожному матчі. Я відчуваю, що команда росте з кожною грою.&raquo;</p>',
  '<h3>Про підготовку</h3>',
  '<p>На зборах ми багато працювали над фізикою та тактикою. Тренерський штаб дав чіткий план, і тепер ми готові до старту.</p>',
  '<img src="https://fcruhlviv.com/storage/post/img/title/vCxOPXu5hpiLXuuTfJ75db6hG2CP4ZKtHykhzYH9.jpg" alt="">',
  '<p>&laquo;Наша ціль &ndash; боротися за найвищі місця. Дякуємо фанатам за підтримку!&raquo;</p>',
].join('');

/** Backend group "news". */
export const newsApi = {
  list: (params: T.NewsListParams) =>
    axiosInstance.get<T.NewsListResponse>('news/list', { params }),
  body: (slug: string) =>
    Promise.resolve({
      data: { slug, body: MOCK_BODY },
    } as AxiosResponse<T.NewsPostBody>),
} as const;
