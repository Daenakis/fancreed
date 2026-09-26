import type * as T from '@/types/api';

import { axiosInstance } from '../client';

/** Backend group "auth" — one method per endpoint. */
export const authApi = {
  login: (params: T.LoginRequest) =>
    axiosInstance.post<T.LoginResponse>('auth/login', params),

  logout: () => axiosInstance.get<void>('auth/logout'),

  register: (params: T.RegistrationRequest) =>
    axiosInstance.post<void>('auth/registration', params),

  activate: (params: T.ActivateRequest) =>
    axiosInstance.post<void>('auth/activate', params),

  resendActivationCode: (params: T.ResendCodeRequest) =>
    axiosInstance.post<void>('auth/resendcode', params),

  forgotPassword: (params: T.ForgotPasswordRequest) =>
    axiosInstance.post<void>('auth/forgotpass', params),

  recoverPassword: (params: T.RecoverPasswordRequest) =>
    axiosInstance.post<void>('auth/recoverypass', params),

  deleteAccount: () => axiosInstance.delete<void>('auth/self'),
} as const;
