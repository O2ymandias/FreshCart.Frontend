import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  ILatestRatingsResult,
  IRatingItem,
} from '../../../shared/models/rating.model';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs';
import {
  ILatestOrdersResult,
  IOrderResult,
} from '../../../shared/models/orders-model';
import {
  IChangePasswordOptions,
  IRequestEmailChangeOptions,
  IUserInfoResult,
  IUserShippingAddress,
} from '../../../shared/models/auth-model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly _httpClient = inject(HttpClient);

  userInfo = signal<IUserInfoResult | null>(null);

  LATEST_RATINGS_LIMIT = 5;
  userLatestRatings = signal<IRatingItem[]>([]);
  userLatestRatingsCount = signal(0);

  Latest_ORDERS_LIMIT = 5;
  userLatestOrders = signal<IOrderResult[]>([]);
  userLatestOrdersCount = signal(0);

  getUserInfo() {
    const url = `${environment.apiUrl}/account/user-info`;
    return this._httpClient
      .get<IUserInfoResult>(url)
      .pipe(tap((res) => this.userInfo.set(res)));
  }

  getUserAddress() {
    const url = `${environment.apiUrl}/account/address`;
    return this._httpClient.get<IUserShippingAddress>(url);
  }

  getLatestRatings() {
    const url = `${environment.apiUrl}/ratings/latest`;

    let params = new HttpParams();
    params = params.append('limit', this.LATEST_RATINGS_LIMIT.toString());

    return this._httpClient
      .get<ILatestRatingsResult>(url, {
        params,
      })
      .pipe(
        tap((res) => {
          this.userLatestRatings.set(res.latestRatings);
          this.userLatestRatingsCount.set(res.count);
        }),
      );
  }

  getLatestOrders() {
    const url = `${environment.apiUrl}/orders/latest`;
    let params = new HttpParams();
    params = params.append('limit', this.Latest_ORDERS_LIMIT.toString());

    return this._httpClient.get<ILatestOrdersResult>(url, { params }).pipe(
      tap((res) => {
        this.userLatestOrders.set(res.latestOrders);
        this.userLatestOrdersCount.set(res.count);
      }),
    );
  }

  forgetPassword(email: string) {
    const url = `${environment.apiUrl}/account/forget-password`;
    return this._httpClient.post<{ message: string }>(url, {
      email,
    });
  }

  resetPassword(email: string, token: string, newPassword: string) {
    const url = `${environment.apiUrl}/account/reset-password`;
    return this._httpClient.post<{ message: string }>(url, {
      email,
      token,
      newPassword,
    });
  }

  changePassword(options: IChangePasswordOptions) {
    const url = `${environment.apiUrl}/account/change-password`;
    return this._httpClient.put<{ message: string }>(url, options);
  }

  updateBasicInfo(data: FormData) {
    const url = `${environment.apiUrl}/account/basic-info`;
    return this._httpClient.put<{ message: string }>(url, data);
  }

  requestEmailChange(options: IRequestEmailChangeOptions) {
    const url = `${environment.apiUrl}/account/request-email-change`;
    return this._httpClient.post<{ message: string }>(url, options);
  }

  confirmEmailChange(verificationCode: string) {
    const url = `${environment.apiUrl}/account/confirm-email-change`;
    return this._httpClient.post<{ message: string }>(url, {
      verificationCode,
    });
  }
}
