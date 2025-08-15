import { Component, inject } from '@angular/core';
import { ProductReviewComponent } from '../../product-details/product-reviews/product-review/product-review.component';
import { RouterLink } from '@angular/router';
import { NotfoundResourceComponent } from '../../../shared/components/notfound-resource/notfound-resource.component';
import { RatingService } from '../../../core/services/rating/rating.service';
import { IRatingItem } from '../../../shared/models/rating.model';
import { EMPTY, switchMap } from 'rxjs';
import { AccountService } from '../../../core/services/account/account.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-account-latest-reviews',
  imports: [
    ProductReviewComponent,
    RouterLink,
    NotfoundResourceComponent,
    TranslatePipe,
  ],
  templateUrl: './account-latest-reviews.component.html',
  styleUrl: './account-latest-reviews.component.scss',
})
export class AccountLatestReviewsComponent {
  private readonly _accountService = inject(AccountService);
  private readonly _ratingService = inject(RatingService);

  latestRatings = this._accountService.userLatestRatings;

  deleteRating(rating: IRatingItem) {
    this._ratingService
      .deleteRating(rating.id)
      .pipe(
        switchMap((deleted) => {
          if (deleted) {
            return this._accountService.getLatestRatings();
          } else return EMPTY;
        }),
      )
      .subscribe();
  }
}
