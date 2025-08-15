import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ICheckoutResult } from '../../../shared/models/checkout.models';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly _httpClient = inject(HttpClient);

  checkout(orderId: number) {
    return this._httpClient.post<ICheckoutResult>(
      `${environment.apiUrl}/checkout/${orderId}`,
      null,
    );
  }

  retrieveCheckoutSession(orderId: number) {
    return this._httpClient.get<ICheckoutResult>(
      `${environment.apiUrl}/checkout/${orderId}`,
    );
  }
}
