import { Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SecureStorageService } from '../storage/secure-storage.service';
import { AuthVars } from '../../constants/auth';
import { API_URLS } from '../../constants/apiurls';
import { ToastService } from '../toast/toast.service';
import { map, catchError } from 'rxjs/operators';
import { ToastEvent } from '../../constants/toast';
import { ApiResponse } from '../../models/apiresponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends BaseApiService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly IS_AUTHENTICATED = AuthVars.IS_AUTHENTICATED;
  private readonly AUTHORIZATION = AuthVars.AUTHORIZATION;
  private readonly LOGGED_AT = AuthVars.LOGGED_AT;

  constructor(
    http: HttpClient,
    private toastService: ToastService,
    private secureStorage: SecureStorageService,
    private router: Router
  ) {
    super(http);
    const isAuthenticated =
      this.secureStorage.get(this.IS_AUTHENTICATED) || false;
    const loggedAt = this.secureStorage.get(this.LOGGED_AT);

    if (isAuthenticated && this.isValidLoginTime(loggedAt)) {
      this.isAuthenticatedSubject.next(true);
    } else {
      this.logout();
    }
  }

  login(username: string, password: string): Observable<boolean> {
    const requestBody = { username: username, password: password };
    return this.post<ApiResponse<any>>(
      API_URLS.AUTHENTICATE_ENDPOINT,
      requestBody
    ).pipe(
      map((data) => {
        this.toastService.show(
          this.toastService.createToast(data.message, ToastEvent.Success)
        );
        const loginTime = new Date().toISOString();
        this.secureStorage.set(this.IS_AUTHENTICATED, true);
        this.secureStorage.set(
          this.AUTHORIZATION,
          btoa(`${username}:${password}`)
        );
        this.secureStorage.set(AuthVars.LOGGED_AT, loginTime);
        this.isAuthenticatedSubject.next(true);
        return true;
      }),
      catchError((error) => {
        console.error('Login failed', error);
        this.toastService.show(
          this.toastService.createToast(error.error.message, ToastEvent.Danger)
        );
        return of(false);
      })
    );
  }

  logout(): void {
    this.secureStorage.remove(this.IS_AUTHENTICATED);
    this.secureStorage.remove(this.AUTHORIZATION);
    this.secureStorage.remove(this.LOGGED_AT);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  get isAuthenticated$(): Observable<boolean> {
    const loggedAt = this.secureStorage.get(this.LOGGED_AT);
    if (this.isValidLoginTime(loggedAt)) {
      return this.isAuthenticatedSubject.asObservable();
    } else {
      this.logout();
      return of(false);
    }
  }

  private isValidLoginTime(loggedAt: string | null): boolean {
    if (!loggedAt) {
      return false;
    }
    const loggedAtTime = new Date(loggedAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - loggedAtTime;
    const TEN_MINUTES = 10 * 60 * 1000;
    return timeDifference <= TEN_MINUTES;
  }
}
