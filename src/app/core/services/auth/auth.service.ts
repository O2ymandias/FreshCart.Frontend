import {
  IAuthResult,
  IJwtPayload,
  ILoginUser,
  IRegisterUser,
} from './../../../shared/models/auth-model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _router = inject(Router);

  jwtToken = signal<string | null>(null);
  refreshTokenExpiresOn = signal<string | null>(null);
  isAuthenticated = computed(() => {
    const token = this.jwtToken();
    if (!token) return false;

    const refreshTokenExpiresOn = this.refreshTokenExpiresOn();
    if (!refreshTokenExpiresOn) return false;

    return new Date(refreshTokenExpiresOn) > new Date();
  });

  jwtPayload = computed(() => {
    const token = this.jwtToken();
    if (!token) return null;
    return jwtDecode<IJwtPayload>(token);
  });

  register(register: IRegisterUser) {
    const url = `${environment.authUrl}/register`;
    return this._httpClient
      .post<IAuthResult>(url, register, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.jwtToken.set(res.token);
          this.refreshTokenExpiresOn.set(res.refreshTokenExpiresOn);
        }),
      );
  }

  login(login: ILoginUser) {
    const url = `${environment.authUrl}/login`;

    return this._httpClient
      .post<IAuthResult>(url, login, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.jwtToken.set(res.token);
          this.refreshTokenExpiresOn.set(res.refreshTokenExpiresOn);
        }),
      );
  }

  refreshToken() {
    return this._httpClient
      .get<IAuthResult>(`${environment.authUrl}/refresh-token`, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.jwtToken.set(res.token);
          this.refreshTokenExpiresOn.set(res.refreshTokenExpiresOn);
        }),

        catchError((err: HttpErrorResponse) => {
          if (err.status === 401 || err.status === 400) {
            this.clearToken();
          }
          return throwError(() => err);
        }),
      );
  }

  revokeToken() {
    return this._httpClient
      .get<boolean>(`${environment.authUrl}/revoke-token`, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.clearToken();
        }),
      );
  }

  clearToken() {
    this.jwtToken.set(null);
    this.refreshTokenExpiresOn.set(null);
  }

  logout() {
    this._router.navigate(['/']);
    return this.revokeToken();
  }

  decodeToken(token: string) {
    return jwtDecode(token);
  }
}
