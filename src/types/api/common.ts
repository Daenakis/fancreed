/** Error body returned by the backend for 4xx/5xx responses. */
export type ApiErrorBody = {
  /** Machine-readable-ish text, e.g. "Wrong password", "Bad request". */
  message: string;
  description?: string;
  /** Present on 400 "Bad request": names of the rejected fields. */
  invalidParameters?: string[];
};
