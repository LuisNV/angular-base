import { Injectable, signal } from '@angular/core';
import { AuthSession } from '../../features/auth/domain/models/auth.models';

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessToken = signal(this.readAccessToken());
  private readonly refreshToken = signal(this.readRefreshToken());

  isAuthenticated(): boolean {
    return Boolean(this.accessToken());
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  getRefreshToken(): string | null {
    return this.refreshToken();
  }

  setSession(session: AuthSession): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    this.accessToken.set(session.accessToken);
    this.refreshToken.set(session.refreshToken);
  }


  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.accessToken.set(null);
    this.refreshToken.set(null);
  }

  private readAccessToken(): string | null {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token?.trim() || null;
  }

  private readRefreshToken(): string | null {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);
    return token?.trim() || null;
  }
}
