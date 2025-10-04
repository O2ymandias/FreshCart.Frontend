import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  IBrand,
  ICategory,
  IProduct,
  IProductOptions,
  IProductResponse,
  ProductGalleryResponse,
  ProductSortSelectOption,
} from '../../../shared/models/product.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _products = signal<IProduct[]>([]);
  private _brands = signal<IBrand[]>([]);
  private _categories = signal<ICategory[]>([]);

  readonly DEFAULT_PAGE_SIZE = 10;
  readonly DEFAULT_PAGE_NUMBER = 1;

  products = this._products.asReadonly();
  brands = this._brands.asReadonly();
  categories = this._categories.asReadonly();

  credentials = signal<IProductOptions>({
    pageNumber: this.DEFAULT_PAGE_NUMBER,
    pageSize: this.DEFAULT_PAGE_SIZE,
  });

  sort = signal<ProductSortSelectOption | undefined>(undefined);
  search = signal('');

  getProducts(credentials?: IProductOptions) {
    let url = `${environment.apiUrl}/products`;
    let params = new HttpParams();

    if (credentials) {
      if (credentials.pageNumber) {
        params = params.append('pageNumber', credentials.pageNumber);
      }

      if (credentials.pageSize) {
        params = params.append('pageSize', credentials.pageSize);
      }

      if (credentials.brandId) {
        params = params.append('brandId', credentials.brandId);
      }

      if (credentials.categoryId) {
        params = params.append('categoryId', credentials.categoryId);
      }

      if (credentials.sortKey) {
        params = params.append('sort.Key', credentials.sortKey);
      }

      if (credentials.sortDir) {
        params = params.append('sort.Dir', credentials.sortDir);
      }

      if (credentials.search) {
        params = params.append('search', credentials.search);
      }

      if (credentials.minPrice && credentials.minPrice > 0)
        params = params.append('minPrice', credentials.minPrice);

      if (credentials.maxPrice && credentials.maxPrice > 0)
        params = params.append('maxPrice', credentials.maxPrice);
    }

    return this._httpClient.get<IProductResponse>(url, { params }).pipe(
      tap((res) => {
        this._products.set(res.results);
      }),
    );
  }

  getProductById(id: number) {
    let url = `${environment.apiUrl}/products/${id}`;
    return this._httpClient.get<IProduct>(url);
  }

  getBrands() {
    let url = `${environment.apiUrl}/brands`;
    let params = new HttpParams();

    return this._httpClient
      .get<IBrand[]>(url, { params })
      .pipe(tap((res) => this._brands.set(res)));
  }

  getCategories() {
    let url = `${environment.apiUrl}/categories`;
    let params = new HttpParams();

    return this._httpClient
      .get<ICategory[]>(url, { params })
      .pipe(tap((res) => this._categories.set(res)));
  }

  reset() {
    this.credentials.set({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.DEFAULT_PAGE_SIZE,
    });

    this.resetSort();
    this.resetSearch();
  }

  resetSort() {
    this.sort.set(undefined);
  }
  resetSearch() {
    this.search.set('');
  }

  getMaxOrderQuantity(productId: number) {
    return this._httpClient.get<number>(
      `${environment.apiUrl}/products/${productId}/max-order-quantity`,
    );
  }

  getProductGallery(productId: number) {
    return this._httpClient.get<ProductGalleryResponse>(
      `${environment.apiUrl}/products/gallery/${productId}`,
    );
  }
}
