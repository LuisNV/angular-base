import { Injectable, signal } from '@angular/core';
import { AuthSession } from '../../features/auth/domain/models/auth.models';

const ACCESS_TOKEN_KEY = 'auth.accessToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessToken = signal(this.readAccessToken());

  isAuthenticated(): boolean {
    return Boolean(this.accessToken());
  }

  setSession(session: AuthSession): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    this.accessToken.set(session.accessToken);
  }

  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.accessToken.set(null);
  }

  private readAccessToken(): string | null {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token?.trim() || null;
  }
}
