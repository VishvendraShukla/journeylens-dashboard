import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  constructor(protected http: HttpClient) {}

  private readonly baseUrl = environment.apiBaseUrl;

  protected handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }

  protected get<T = any>(url: string): Observable<T> {
    return this.http
      .get<T>(this.baseUrl + url)
      .pipe(catchError(this.handleError.bind(this)));
  }

  protected post<T = any>(url: string, body: any): Observable<T> {
    return this.http
      .post<T>(this.baseUrl + url, body)
      .pipe(catchError(this.handleError.bind(this)));
  }

  protected put<T = any>(url: string, body: any): Observable<T> {
    return this.http
      .put<T>(this.baseUrl + url, body)
      .pipe(catchError(this.handleError.bind(this)));
  }
}
