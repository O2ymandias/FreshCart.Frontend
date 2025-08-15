import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { securedApis } from '../../../environments/environment';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  throwError,
} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const securedApi = securedApis.some(
    (endPoint) =>
      req.method === endPoint.method && req.url.includes(endPoint.path),
  );
  if (!securedApi) return next(req); // Skip auth for non-secured APIS

  const token = authService.jwtToken();
  if (!token) return next(req); // Proceed the request, eventually handle (unauthorized 401).

  const authReq = addAuthHeader(req, token); // Adds Authorization header.

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        return handleUnauthorizedError(req, next, authService, err);
      }

      return throwError(() => err);
    }),
  );
};

function addAuthHeader(req: any, token: string) {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
  string | null
>(null);

function handleUnauthorizedError(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  originalError: HttpErrorResponse,
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(() => {
        const newToken = authService.jwtToken();
        if (!newToken) {
          authService.logout();
          return throwError(() => originalError); // Refresh succeeded but (something is wrong "Token is null for some reason")
        }

        refreshTokenSubject.next(newToken);

        const retryReq = addAuthHeader(req, newToken);
        return next(retryReq);
      }),

      // Refresh failed -> user needs to re-authenticate
      catchError((refreshError: HttpErrorResponse) => {
        if (refreshError.status === 401 || refreshError.status === 400) {
          authService.logout();
        }
        return throwError(() => refreshError);
      }),
      finalize(() => {
        isRefreshing = false;
      }),
    );
  } else {
    // Token refresh is already in progress -> wait for it to complete
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        if (token) {
          return next(addAuthHeader(req, token));
        }
        return throwError(() => originalError);
      }),
    );
  }
}
