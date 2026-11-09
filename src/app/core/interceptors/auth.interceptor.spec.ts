import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../services/auth.service';
import { TokenRefreshService } from '../services/token-refresh.service';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let token: string | null;

  beforeEach(() => {
    token = 'test-token';
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { getAccessToken: () => token } },
        { provide: TokenRefreshService, useValue: {} },
        { provide: Router, useValue: {} },
      ],
    });
  });

  function intercept(request: HttpRequest<unknown>) {
    const next = vi.fn().mockReturnValue(EMPTY);
    TestBed.runInInjectionContext(() => authInterceptor(request, next));
    return next.mock.calls[0][0] as HttpRequest<unknown>;
  }

  it('attaches the current token to profile requests', () => {
    expect(intercept(new HttpRequest('GET', '/auth/me')).headers.get('Authorization'))
      .toBe('Bearer test-token');
    token = null;
    expect(intercept(new HttpRequest('GET', '/auth/me')).headers.has('Authorization'))
      .toBe(false);
  });

  it('does not send credentials to external URLs', () => {
    for (const url of ['https://third-party.example/data', '//third-party.example/data']) {
      expect(intercept(new HttpRequest('GET', url)).headers.has('Authorization')).toBe(false);
    }
  });

  it('preserves an explicitly supplied authorization header', () => {
    const request = new HttpRequest('GET', '/auth/me').clone({
      setHeaders: { Authorization: 'Basic custom' },
    });
    expect(intercept(request).headers.get('Authorization')).toBe('Basic custom');
  });
});
