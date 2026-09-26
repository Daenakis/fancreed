// API request/response types.
// ⚠️ Auth field names are assumed — align with the real backend contract.

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = AuthTokens;

export type RefreshRequest = {
  refreshToken: string;
};

export type RefreshResponse = AuthTokens;

export type ErrorResponse = {
  message: string;
  status: number;
};
