import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IDeliveryMethod } from '../../../shared/models/checkout.model';
import {
  ICancelOrderResult,
  ICreateOrderResponse,
  IOrderInput,
  IOrderOptions,
  IOrderResponse,
  IOrderResult,
  OrderSortSelectOption,
  OrderStatus,
} from '../../../shared/models/orders-model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _orders = signal<IOrderResult[]>([]);

  readonly DEFAULT_PAGE_SIZE = 5;
  readonly DEFAULT_PAGE_NUMBER = 1;
  readonly SORT_OPTIONS: OrderSortSelectOption[] = [
    {
      key: 'createdAt',
      dir: 'desc',
      label: {
        en: 'Latest First',
        ar: 'الأحدث اولا',
      },
    },
    {
      key: 'createdAt',
      dir: 'asc',
      label: {
        en: 'Oldest First',
        ar: 'الأقدم اولا',
      },
    },
    {
      key: 'price',
      dir: 'asc',
      label: {
        en: 'Price: Low to High',
        ar: 'السعر من الأقل للاعلى',
      },
    },
    {
      key: 'price',
      dir: 'desc',
      label: {
        en: 'Price: High to Low',
        ar: 'السعر من الأعلى للاقل',
      },
    },
  ];
  readonly FILTER_OPTIONS: {
    value: OrderStatus;
    label: { en: string; ar: string };
  }[] = [
    {
      value: 'Pending',
      label: {
        en: 'Pending',
        ar: 'معلق',
      },
    },
    {
      value: 'Processing',
      label: {
        en: 'Processing',
        ar: 'قيد التنفيذ',
      },
    },
    {
      value: 'Shipped',
      label: {
        en: 'Shipped',
        ar: 'تم الشحن',
      },
    },
    {
      value: 'Delivered',
      label: {
        en: 'Delivered',
        ar: 'تم التوصيل',
      },
    },
    {
      value: 'Cancelled',
      label: {
        en: 'Cancelled',
        ar: 'ملغي',
      },
    },
  ];

  orders = this._orders.asReadonly();
  count = signal<number | null>(null);
  currPageNumber = signal(this.DEFAULT_PAGE_NUMBER);
  pageSize = this.DEFAULT_PAGE_SIZE;
  filter = signal<OrderStatus | undefined>(undefined);
  sort = signal<OrderSortSelectOption | undefined>(undefined);
  searchQuery = signal<string>('');

  getDeliveryMethods() {
    let url = `${environment.apiUrl}/orders/delivery-methods`;
    return this._httpClient.get<IDeliveryMethod[]>(url);
  }

  createOrder(orderInput: IOrderInput) {
    return this._httpClient.post<ICreateOrderResponse>(
      `${environment.apiUrl}/orders`,
      orderInput,
    );
  }

  getOrders(options?: IOrderOptions) {
    let params = new HttpParams();
    params = params.append(
      'pageNumber',
      options?.pageNumber ?? this.DEFAULT_PAGE_NUMBER,
    );

    params = params.append(
      'pageSize',
      options?.pageSize ?? this.DEFAULT_PAGE_SIZE,
    );

    if (options?.orderId) params = params.append('orderId', options.orderId);

    if (options?.sort) {
      params = params.append('sort.Dir', options.sort.dir);
      params = params.append('sort.Key', options.sort.key);
    }

    if (options?.filter) params = params.append('orderStatus', options.filter);

    return this._httpClient
      .get<IOrderResponse>(`${environment.apiUrl}/orders`, {
        withCredentials: true,
        params,
      })
      .pipe(
        tap((res) => {
          this._orders.set(res.results);
          this.count.set(res.total);
        }),
      );
  }

  getOrdersCount() {
    return this._httpClient
      .get<{ count: number }>(`${environment.apiUrl}/orders/count`)
      .pipe(tap((res) => this.count.set(res.count)));
  }

  cancelOrder(orderId: number) {
    return this._httpClient.delete<ICancelOrderResult>(
      `${environment.apiUrl}/orders/${orderId}`,
    );
  }

  reset() {
    this.filter.set(undefined);
    this.sort.set(undefined);
    this.searchQuery.set('');
  }
}
