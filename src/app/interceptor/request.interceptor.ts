import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoggingService } from '../services/logging/logging.service';
import { SecureStorageService } from '../services/storage/secure-storage.service';
import { API_URLS } from '../constants/apiurls';
import { AuthVars } from '../constants/auth';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private loggingService: LoggingService,
    private storageService: SecureStorageService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let headers = this.createEssentialHeaders();
    if (!request.url.includes(API_URLS.AUTHENTICATE_ENDPOINT)) {
      headers = headers.set(
        'Authorization',
        `Basic ${this.storageService.get(AuthVars.AUTHORIZATION)}`
      );
    }
    const requestClone = request.clone({ headers });
    this.loggingService.log(requestClone);
    return next.handle(requestClone);
  }

  private createEssentialHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return headers;
  }
}
