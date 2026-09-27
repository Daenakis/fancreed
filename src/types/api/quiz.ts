// Quiz ("Вікторина"). TODO(backend): no endpoint yet — mocked in `quizApi`.

export type QuizQuestion = {
  id: string;
  text: string;
  options: string[];
};

export type Quiz = {
  id: string;
  questions: QuizQuestion[];
};

/** Answer = index of the chosen option, per question id. */
export type QuizAnswers = Record<string, number>;

export type QuizResult = {
  /** 0–100. */
  score: number;
  /** Place in the fans' rating. */
  place: number;
};
