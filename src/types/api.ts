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

// ── Password reset (assumed contract — confirm with backend) ─────────
export type PasswordResetRequest = {
  /** Email or phone number the account was registered with. */
  login: string;
};

export type VerifyResetCodeRequest = {
  login: string;
  code: string;
};

export type VerifyResetCodeResponse = {
  /** Short-lived token that authorises setting a new password. */
  resetToken: string;
};

export type ResetPasswordRequest = {
  resetToken: string;
  password: string;
};
