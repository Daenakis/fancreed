// API response types
// Example:
//

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type ErrorResponse = {
  message: string;
  status: number;
};
