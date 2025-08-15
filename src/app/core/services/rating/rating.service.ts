import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  IRatingInput,
  IRatingItem,
  IRatingOptions,
  RatingResult,
} from '../../../shared/models/rating.model';
import { EMPTY, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private readonly _httpClient = inject(HttpClient);

  DEFAULT_PAGE_NUMBER = 1;
  DEFAULT_PAGE_SIZE = 5;

  productRatings = signal<IRatingItem[]>([]);
  productAverageRating = signal(0);
  productTotalRatings = signal(0);

  getRatings(options: IRatingOptions) {
    let params = new HttpParams();
    const { pageNumber, pageSize } = options.pagination;
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

    if (options.productId)
      params = params.append('productId', options.productId);
    if (options.userId) params = params.append('userId', options.userId);

    return this._httpClient
      .get<RatingResult>(`${environment.apiUrl}/ratings`, {
        params,
      })
      .pipe(tap((res) => this._initProductRatings(res)));
  }

  addRating(rating: IRatingInput, currProductId: number) {
    return this._httpClient
      .post<boolean>(`${environment.apiUrl}/ratings`, rating)
      .pipe(
        switchMap((added) => {
          if (added) {
            return this.getRatings({
              productId: currProductId,
              pagination: {
                pageSize: this.DEFAULT_PAGE_SIZE,
                pageNumber: this.DEFAULT_PAGE_NUMBER,
              },
            });
          }
          return EMPTY;
        }),
      );
  }

  deleteRating(ratingId: number) {
    return this._httpClient.delete<boolean>(
      `${environment.apiUrl}/ratings/${ratingId}`,
    );
  }

  private _initProductRatings(response: RatingResult) {
    const { average, total, results } = response;
    this.productAverageRating.set(average);
    this.productTotalRatings.set(total);
    this.productRatings.set(results);
  }
}
