export interface LoginCredentials {
  readonly identifier: string;
  readonly password: string;
}

export interface AuthSession {
  readonly accessToken: string;
}
