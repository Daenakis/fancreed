import { fireEvent, render } from '@tests/test-utils';

import { QuizBlock } from '@/features/gamification';

describe('QuizBlock', () => {
  it('keeps Next disabled until an answer is picked', async () => {
    const { findByRole } = render(<QuizBlock />);

    expect(await findByRole('button', { name: 'quiz.next' })).toBeDisabled();
  });

  it('shows the score and rating place after the last question', async () => {
    const { findAllByRole, getAllByRole, getByRole, findByText } = render(
      <QuizBlock />,
    );

    for (let i = 0; i < 12; i++) {
      const options =
        i === 0 ? await findAllByRole('radio') : getAllByRole('radio');
      fireEvent.press(options[0]!);
      fireEvent.press(
        getByRole('button', {
          name: i === 11 ? 'quiz.showResult' : 'quiz.next',
        }),
      );
    }

    expect(await findByText('quiz.result')).toBeTruthy();
    expect(getByRole('button', { name: 'votes.share' })).toBeTruthy();
  });
});
