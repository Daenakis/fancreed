import { apiOk, fireEvent, render, waitFor } from '@tests/test-utils';

import { quizApi } from '@/api';

import type { Quiz, QuizResult } from '@/types/api';

import { QuizBlock } from '@/features/gamification';

const quiz: Quiz = {
  _id: 'quiz1',
  title: { en: 'Quiz', uk: 'Вікторина' },
  questions: [1, 2].map((n) => ({
    _id: `q${n}`,
    text: { en: `Question ${n}`, uk: `Питання ${n}` },
    options: ['A', 'B', 'C'].map((o) => ({ en: `${o}${n}`, uk: `${o}${n}` })),
  })),
};

const result: QuizResult = {
  correct: 1,
  total: 2,
  answers: [0, 1],
  betterThan: 64,
};

const mockQuiz = (yourResult: QuizResult | null = null) =>
  jest.spyOn(quizApi, 'actual').mockResolvedValue(apiOk({ quiz, yourResult }));

describe('QuizBlock', () => {
  it('shows the question and options in the app language', async () => {
    mockQuiz();
    const { findByText, getByText } = render(<QuizBlock />);

    expect(await findByText('Question 1')).toBeTruthy();
    expect(getByText('B1')).toBeTruthy();
  });

  it('keeps Next disabled until an answer is picked', async () => {
    mockQuiz();
    const { findByRole } = render(<QuizBlock />);

    expect(await findByRole('button', { name: 'quiz.next' })).toBeDisabled();
  });

  it('sends the answers in question order and shows the result', async () => {
    mockQuiz();
    const answer = jest
      .spyOn(quizApi, 'answer')
      .mockResolvedValue(apiOk({ result }));
    const { findAllByRole, getAllByRole, getByRole, findByText } = render(
      <QuizBlock />,
    );

    fireEvent.press((await findAllByRole('radio'))[0]!);
    fireEvent.press(getByRole('button', { name: 'quiz.next' }));
    fireEvent.press(getAllByRole('radio')[1]!);
    fireEvent.press(getByRole('button', { name: 'quiz.showResult' }));

    await waitFor(() =>
      expect(answer).toHaveBeenCalledWith({ quiz: 'quiz1', answers: [0, 1] }),
    );
    expect(await findByText('quiz.result')).toBeTruthy();
    expect(getByRole('button', { name: 'common.share' })).toBeTruthy();
  });

  it('shows a saved result with right answers and the better-than share', async () => {
    mockQuiz(result);
    const { findByLabelText, getByText } = render(<QuizBlock />);

    expect(await findByLabelText('quiz.correct')).toBeTruthy();
    expect(getByText('1/2')).toBeTruthy();
    expect(getByText('quiz.betterThan')).toBeTruthy();
  });

  it('renders nothing when no quiz is running', async () => {
    jest
      .spyOn(quizApi, 'actual')
      .mockResolvedValue(apiOk({ quiz: null, yourResult: null }));
    const { toJSON } = render(<QuizBlock />);

    await waitFor(() => expect(toJSON()).toBeNull());
  });
});
