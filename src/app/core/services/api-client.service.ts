import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiClient {
    private readonly http = inject(HttpClient);

    get<T>(path: string, params?: HttpParams) {
        return this.http.get<T>(path, { params });
    }

    post<T>(path: string, body: unknown) {
        return this.http.post<T>(path, body);
    }

    put<T>(path: string, body: unknown) {
        return this.http.put<T>(path, body);
    }

    delete<T>(path: string) {
        return this.http.delete<T>(path);
    }
}