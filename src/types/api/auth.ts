// Contract from the backend apidoc (group "auth"), checked against
// https://app.fancreed.com/api on 2026-09-26.

export type PushTokenPayload = {
  token: string;
  os: 'android' | 'ios';
};

export type LoginRequest = {
  /** The user's email. */
  login: string;
  password: string;
  pnToken?: PushTokenPayload;
};

export type LoginResponse = {
  userId: string;
  /** False until the email is confirmed with the activation code. */
  activated: boolean;
  userRole: string;
  /** JWT, valid ~90 days. There is no refresh token. */
  access_token: string;
  token_type: 'Bearer';
};

export type RegistrationRequest = {
  name: string;
  email: string;
  password: string;
  surname?: string;
  patronymic?: string;
};

export type ActivateRequest = {
  email: string;
  /** 4 digits from the activation email. */
  code: string;
};

export type ResendCodeRequest = {
  email: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type RecoverPasswordRequest = {
  email: string;
  /** 8 characters from the recovery email. */
  code: string;
  password: string;
};
