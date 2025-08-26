// src/app/core/services/api.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Generic API service for making HTTP requests.
 * Uses inject() for HttpClient and providedIn: 'root' for singleton.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.httpClient.get<T>(`${this.baseUrl}${path}`, { params });
  }

  post<T>(path: string, body: object): Observable<T> {
    return this.httpClient.post<T>(`${this.baseUrl}${path}`, body);
  }

  put<T>(path: string, body: object): Observable<T> {
    return this.httpClient.put<T>(`${this.baseUrl}${path}`, body);
  }

  delete<T>(path: string, params?: HttpParams): Observable<T> {
    return this.httpClient.delete<T>(`${this.baseUrl}${path}`, { params });
  }
}