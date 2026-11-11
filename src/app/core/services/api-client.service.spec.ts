import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiClient } from './api-client.service';

describe('ApiClient response envelope', () => {
  let api: ApiClient;
  let requests: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ApiClient);
    requests = TestBed.inject(HttpTestingController);
  });

  afterEach(() => requests.verify());

  it('returns data for each supported HTTP method', () => {
    const data = { id: 1 };
    for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
      const result = vi.fn();
      const response = method === 'GET' ? api.get('/resource')
        : method === 'POST' ? api.post('/resource', data)
        : method === 'PUT' ? api.put('/resource', data)
        : api.delete('/resource');
      response.subscribe(result);
      const request = requests.expectOne('/resource');
      expect(request.request.method).toBe(method);
      request.flush({ code: 0, httpStatus: 200, message: 'Success', data, traceId: 'trace-1' });
      expect(result).toHaveBeenCalledWith(data);
    }
  });

  it('allows a null data response for logout', () => {
    const result = vi.fn();
    api.post<void>('/auth/logout', { refreshToken: 'token' }).subscribe(result);
    requests.expectOne('/auth/logout').flush({
      code: 0, httpStatus: 200, message: 'Success', data: null, traceId: 'trace-2',
    });
    expect(result).toHaveBeenCalledWith(null);
  });

  it('preserves the server error envelope', () => {
    const error = vi.fn();
    const body = { code: 1001, httpStatus: 400, message: 'Invalid input', data: null, traceId: 'trace-3' };
    api.get('/resource').subscribe({ error });
    requests.expectOne('/resource').flush(body, { status: 400, statusText: 'Bad Request' });
    expect(error.mock.calls[0][0].error).toEqual(body);
  });
});
