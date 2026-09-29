// Backend group "quizzes".

/** A text in every app language. */
export type LocalizedText = { en: string; uk: string };

export type QuizQuestion = {
  _id: string;
  text: LocalizedText;
  options: LocalizedText[];
};

export type Quiz = {
  _id: string;
  title: LocalizedText;
  questions: QuizQuestion[];
};

export type QuizResult = {
  /** Right answers. */
  correct: number;
  /** Questions. */
  total: number;
  /** The fan's option index per question. */
  answers: number[];
  /** 0–100: 100% minus the share of fans with more right answers. */
  betterThan: number;
};

export type QuizResponse = {
  /** `null` when no quiz is running. */
  quiz: Quiz | null;
  /** `null` until the fan answers. */
  yourResult: QuizResult | null;
};

export type QuizAnswerRequest = {
  quiz: string;
  /** Option index per question, in question order. */
  answers: number[];
};

export type QuizAnswerResponse = {
  result: QuizResult;
};
