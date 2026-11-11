import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ApiClient {
    private readonly http = inject(HttpClient);

    get<T>(path: string, params?: HttpParams) {
        return this.http.get<ApiResponse<T>>(path, { params }).pipe(map(response => response.data));
    }

    post<T>(path: string, body: unknown) {
        return this.http.post<ApiResponse<T>>(path, body).pipe(map(response => response.data));
    }

    put<T>(path: string, body: unknown) {
        return this.http.put<ApiResponse<T>>(path, body).pipe(map(response => response.data));
    }

    delete<T>(path: string) {
        return this.http.delete<ApiResponse<T>>(path).pipe(map(response => response.data));
    }
}
