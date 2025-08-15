import { ICart, ICartItem } from './../../../shared/models/cart.model';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _cartId = signal<string>('');
  private readonly _cartItems = signal<ICartItem[]>([]);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      const storedCartId = localStorage.getItem('cartId');
      const cardId = storedCartId ?? `cart:${crypto.randomUUID()}`;
      if (!storedCartId) {
        localStorage.setItem('cartId', cardId);
      }
      this._cartId.set(cardId);
    }
  }
  cartItems = this._cartItems.asReadonly();
  cartId = this._cartId.asReadonly();
  count = computed(() => this._cartItems().length);
  subTotal = computed(() =>
    this.cartItems()
      .map((item) => item.productPrice * item.quantity)
      .reduce((acc, curr) => acc + curr, 0),
  );
  shippingCost = signal(0);
  tax = signal(0);
  total = computed(() => this.subTotal() + this.shippingCost() + this.tax());

  getCart() {
    const url = `${environment.apiUrl}/cart/${this._cartId()}`;
    return this._httpClient
      .get<ICart>(url)
      .pipe(tap((res) => this._cartItems.set(res.items)));
  }

  addToCart(productId: number) {
    const url = `${environment.apiUrl}/cart/add-to-cart`;
    return this._httpClient
      .post<{ message: string }>(url, {
        cartId: this._cartId(),
        productId,
      })
      .pipe(switchMap(() => this.getCart()));
  }

  removeFromCart(productId: number) {
    return this._httpClient
      .delete<{ message: string }>(
        `${environment.apiUrl}/cart/remove-from-cart`,
        {
          body: {
            cartId: this._cartId(),
            productId,
          },
        },
      )
      .pipe(switchMap(() => this.getCart()));
  }

  updateQuantity(productId: number, newQuantity: number) {
    return this._httpClient
      .put<{ message: string }>(`${environment.apiUrl}/cart/update-quantity`, {
        cartId: this._cartId(),
        productId,
        newQuantity,
      })
      .pipe(switchMap(() => this.getCart()));
  }

  clearCart() {
    return this._httpClient
      .delete<boolean>(`${environment.apiUrl}/cart/${this._cartId()}`)
      .pipe(
        tap((cleared) => {
          if (cleared) {
            this._resetCartId();
            this._cartItems.set([]);
          }
        }),
      );
  }

  private _resetCartId(): void {
    const newId = `cart:${crypto.randomUUID()}`;
    localStorage.setItem('cartId', newId);
    this._cartId.set(newId);
  }
}
