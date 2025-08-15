import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../../../core/services/rating/rating.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RateUsComponent } from './rate-us/rate-us.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ProductReviewComponent } from './product-review/product-review.component';
import { AverageRatingComponent } from '../average-rating/average-rating.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { EMPTY, switchMap, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { IRatingItem } from '../../../shared/models/rating.model';
import { TranslatePipe } from '@ngx-translate/core';
import { DynamicNumberPipe } from '../../../shared/pipes/dynamic-number.pipe';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';

@Component({
  selector: 'app-product-reviews',
  imports: [
    FormsModule,
    RateUsComponent,
    ProductReviewComponent,
    AverageRatingComponent,
    PaginationComponent,
    RouterLink,
    TranslatePipe,
    DynamicNumberPipe,
  ],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.scss',
})
export class ProductReviewsComponent {
  private readonly _ratingService = inject(RatingService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _authService = inject(AuthService);
  private readonly _appTranslationService = inject(AppTranslationService);

  constructor() {
    effect(() => {
      const pageNumber = this.currPageNumber();
      this.getRatings$(pageNumber).subscribe();
    });
  }

  locale = this._appTranslationService.locale;
  productId = input.required<number>();
  productRatings = this._ratingService.productRatings;
  productTotalRatings = this._ratingService.productTotalRatings;
  productAverageRating = this._ratingService.productAverageRating;
  currPageNumber = signal(this._ratingService.DEFAULT_PAGE_NUMBER);
  totalPages = signal(0);
  hasNext = signal(false);
  hasPrevious = signal(false);
  isAuthenticated = this._authService.isAuthenticated;

  getRatings$(pageNumber: number) {
    return this._ratingService
      .getRatings({
        productId: this.productId(),
        pagination: {
          pageSize: this._ratingService.DEFAULT_PAGE_SIZE,
          pageNumber,
        },
      })
      .pipe(
        tap((res) => {
          this.currPageNumber.set(res.pageNumber);
          this.totalPages.set(res.pages);
          this.hasNext.set(res.hasNext);
          this.hasPrevious.set(res.hasPrevious);
        }),
        takeUntilDestroyed(this._destroyRef),
      );
  }
  onPageChange(pageNumber: number) {
    if (this.currPageNumber() === pageNumber) return;
    this.currPageNumber.set(pageNumber);
  }
  deleteRating(ratingItem: IRatingItem) {
    this._ratingService
      .deleteRating(ratingItem.id)
      .pipe(
        switchMap((deleted) => {
          if (deleted) return this.getRatings$(this.currPageNumber());
          else return EMPTY;
        }),
      )
      .subscribe();
  }
}
