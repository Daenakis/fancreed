import type { AxiosResponse } from 'axios';

import type * as T from '@/types/api';

// TODO(backend): replace with the real quiz endpoints.
const QUESTIONS: [string, string[], number][] = [
  [
    'Скільки гравців у стартовому складі футбольної команди?',
    ['9', '10', '11', '12'],
    2,
  ],
  [
    'Скільки триває основний час футбольного матчу?',
    ['80 хв', '90 хв', '100 хв', '120 хв'],
    1,
  ],
  ['Скільки замін дозволено в матчі УПЛ?', ['3', '4', '5', '6'], 2],
  [
    'Як називається порушення, коли гравець опиняється за останнім захисником?',
    ['Фол', 'Офсайд', 'Пенальті', 'Кутовий'],
    1,
  ],
  ['З якої відстані б’ють пенальті?', ['9 м', '10 м', '11 м', '12 м'], 2],
  ['Скільки жовтих карток дають вилучення?', ['1', '2', '3', '4'], 1],
  ['У якому місті базується «Рух»?', ['Київ', 'Одеса', 'Львів', 'Харків'], 2],
  [
    'Якого кольору форма «Руху»?',
    ['Синьо-біла', 'Жовто-чорна', 'Червона', 'Зелена'],
    1,
  ],
  ['Скільки таймів у футбольному матчі?', ['1', '2', '3', '4'], 1],
  [
    'Хто може грати руками у своєму штрафному?',
    ['Захисник', 'Капітан', 'Воротар', 'Ніхто'],
    2,
  ],
  [
    'Як називається гол у власні ворота?',
    ['Автогол', 'Дубль', 'Хет-трик', 'Пенальті'],
    0,
  ],
  ['Скільки голів у хет-трику?', ['2', '3', '4', '5'], 1],
];

const QUIZ: T.Quiz = {
  id: 'mock-quiz',
  questions: QUESTIONS.map(([text, options], i) => ({
    id: `q${i + 1}`,
    text,
    options,
  })),
};

const ok = <D>(data: D) => Promise.resolve({ data } as AxiosResponse<D>);

/** Quiz ("Вікторина") — mocked until the backend has it. */
export const quizApi = {
  current: () => ok(QUIZ),
  submit: (answers: T.QuizAnswers) => {
    const correct = QUESTIONS.filter(
      ([, , right], i) => answers[`q${i + 1}`] === right,
    ).length;
    return ok<T.QuizResult>({
      score: Math.round((correct / QUESTIONS.length) * 100),
      place: 12,
    });
  },
} as const;
