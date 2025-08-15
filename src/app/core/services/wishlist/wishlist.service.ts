import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { EMPTY, switchMap, tap } from 'rxjs';
import {
  IWishlistItem,
  IWishlistResult,
} from '../../../shared/models/wishlist.model';
@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _wishlistItems = signal<IWishlistItem[]>([]);
  private readonly _wishlistProductIds = signal<number[]>([]);
  private readonly _total = signal(0);
  readonly DEFAULT_PAGE_NUMBER = 1;
  readonly DEFAULT_PAGE_SIZE = 4;

  wishlistItems = this._wishlistItems.asReadonly();
  wishlistProductIds = this._wishlistProductIds.asReadonly();
  total = this._total.asReadonly();

  pageNumber = signal(this.DEFAULT_PAGE_NUMBER);
  pageSize = signal(this.DEFAULT_PAGE_SIZE);
  pages = signal(0);
  hasNext = signal(false);
  hasPrevious = signal(false);

  getUserWishlistItems(options: { pageNumber: number; pageSize: number }) {
    let params = new HttpParams();
    params = params.append('pageNumber', options.pageNumber.toString());
    params = params.append('pageSize', options.pageSize.toString());

    const url = `${environment.apiUrl}/wishlist`;
    return this._httpClient.get<IWishlistResult>(url, { params }).pipe(
      tap((res) => {
        this._wishlistItems.set(res.results);
        this._total.set(res.total);

        this.pageNumber.set(res.pageNumber);
        this.pageSize.set(res.pageSize);
        this.pages.set(res.pages);
        this.hasNext.set(res.hasNext);
        this.hasPrevious.set(res.hasPrevious);
      }),
      switchMap(() => this.getUserWishlistProductIds()),
    );
  }
  getUserWishlistProductIds() {
    const url = `${environment.apiUrl}/wishlist/product-ids`;
    return this._httpClient
      .get<number[]>(url)
      .pipe(tap((productIds) => this._wishlistProductIds.set(productIds)));
  }
  getTotal() {
    const url = `${environment.apiUrl}/wishlist/total`;
    return this._httpClient
      .get<number>(url)
      .pipe(tap((total) => this._total.set(total)));
  }
  addToWishlist(productId: number) {
    const url = `${environment.apiUrl}/wishlist/add-to-wishlist`;
    return this._httpClient.post<boolean>(url, { productId }).pipe(
      switchMap((added) => {
        if (added) {
          return this.getUserWishlistItems({
            pageNumber: this.DEFAULT_PAGE_NUMBER,
            pageSize: this.DEFAULT_PAGE_SIZE,
          });
        }
        return EMPTY;
      }),
    );
  }
  removeFromWishlist(productId: number) {
    const url = `${environment.apiUrl}/wishlist/remove-from-wishlist`;

    return this._httpClient.delete<boolean>(url, { body: { productId } }).pipe(
      switchMap((deleted) => {
        if (deleted) {
          return this.getUserWishlistItems({
            pageNumber: this.DEFAULT_PAGE_NUMBER,
            pageSize: this.DEFAULT_PAGE_SIZE,
          });
        }
        return EMPTY;
      }),
    );
  }
  reset() {
    this._wishlistItems.set([]);
    this._wishlistProductIds.set([]);
    this._total.set(0);

    this.pageNumber.set(this.DEFAULT_PAGE_NUMBER);
    this.pageSize.set(this.DEFAULT_PAGE_SIZE);
    this.pages.set(0);
    this.hasNext.set(false);
    this.hasPrevious.set(false);
  }
  clearWishlist() {
    const url = `${environment.apiUrl}/wishlist/clear-wishlist`;
    return this._httpClient.delete<boolean>(url).pipe(
      tap((cleared) => {
        if (cleared) {
          this.reset();
        }
      }),
    );
  }
}
