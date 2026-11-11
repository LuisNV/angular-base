import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { apiUrlInterceptor } from './api-url.interceptor';
import { authInterceptor } from './auth.interceptor';

const base = environment.apiUrl.replace(/\/$/, '');

describe('refreshing expired sessions', () => {
  let http: HttpClient;
  let requests: HttpTestingController;
  let auth: AuthService;
  const navigateByUrl = vi.fn().mockResolvedValue(true);

  beforeEach(() => {
    localStorage.clear();
    navigateByUrl.mockClear();
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(withInterceptors([authInterceptor, apiUrlInterceptor])),
      provideHttpClientTesting(),
      { provide: Router, useValue: { navigateByUrl } },
    ] });
    http = TestBed.inject(HttpClient);
    requests = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    auth.setSession({ accessToken: 'old', refreshToken: 'refresh-old' });
  });

  afterEach(() => {
    requests.verify();
    localStorage.clear();
  });

  function reject(url: string) {
    requests.expectOne(`${base}${url}`).flush(null, { status: 401, statusText: 'Unauthorized' });
  }

  it('shares a refresh across concurrent failures and retries with the rotated token', () => {
    const result = vi.fn();
    http.get('/auth/me').subscribe(result);
    http.get('/lessons').subscribe(result);
    reject('/auth/me');
    reject('/lessons');
    const refresh = requests.expectOne(`${base}/auth/refresh`);
    expect(refresh.request.body).toEqual({ refreshToken: 'refresh-old' });
    expect(refresh.request.headers.has('Authorization')).toBe(false);
    refresh.flush({ code: 0, httpStatus: 200, message: 'Success', data: { accessToken: 'new', refreshToken: 'refresh-new' }, traceId: 'trace-refresh' });
    for (const path of ['/auth/me', '/lessons']) {
      const retry = requests.expectOne(`${base}${path}`);
      expect(retry.request.headers.get('Authorization')).toBe('Bearer new');
      retry.flush({ ok: true });
    }
    expect(result).toHaveBeenCalledTimes(2);
    expect(auth.getRefreshToken()).toBe('refresh-new');
  });

  it('clears the session when refresh is rejected without looping', () => {
    const error = vi.fn();
    http.get('/auth/me').subscribe({ error });
    reject('/auth/me');
    reject('/auth/refresh');
    expect(auth.isAuthenticated()).toBe(false);
    expect(navigateByUrl).toHaveBeenCalledWith('/login', { replaceUrl: true });
    expect(error).toHaveBeenCalledOnce();
  });

  it('does not refresh invalid login credentials', () => {
    http.post('/auth/login', {}).subscribe({ error: () => {} });
    reject('/auth/login');
    requests.expectNone(`${base}/auth/refresh`);
  });

  it('does not refresh again when the retried request returns 401', () => {
    const error = vi.fn();
    http.get('/auth/me').subscribe({ error });
    reject('/auth/me');
    requests.expectOne(`${base}/auth/refresh`).flush({ code: 0, httpStatus: 200, message: 'Success', data: { accessToken: 'new', refreshToken: 'new-r' }, traceId: 'trace-refresh' });
    reject('/auth/me');
    requests.expectNone(`${base}/auth/refresh`);
    expect(auth.isAuthenticated()).toBe(false);
    expect(error).toHaveBeenCalledOnce();
  });

  it('does not restore a session cleared while refresh was in flight', () => {
    http.get('/auth/me').subscribe({ error: () => {} });
    reject('/auth/me');
    auth.clearSession();
    requests.expectOne(`${base}/auth/refresh`).flush({ code: 0, httpStatus: 200, message: 'Success', data: { accessToken: 'new', refreshToken: 'new-r' }, traceId: 'trace-refresh' });
    expect(auth.isAuthenticated()).toBe(false);
    requests.expectNone(`${base}/auth/me`);
  });
});
