// Feedback form ("Зворотній зв'язок"). No backend endpoint yet — mocked.

/** A fan's question, complaint or suggestion for the club managers. */
export type SendFeedbackRequest = {
  name: string;
  /** Digits with an optional leading "+". */
  phone: string;
  message: string;
};
