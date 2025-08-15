import { Component, inject } from '@angular/core';
import { Rating } from 'primeng/rating';
import { RatingService } from '../../../core/services/rating/rating.service';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { DynamicNumberPipe } from '../../../shared/pipes/dynamic-number.pipe';

@Component({
  selector: 'app-average-rating',
  imports: [Rating, FormsModule, TranslatePipe, DynamicNumberPipe],
  templateUrl: './average-rating.component.html',
  styleUrl: './average-rating.component.scss',
})
export class AverageRatingComponent {
  private readonly _ratingService = inject(RatingService);
  private readonly _appTranslationService = inject(AppTranslationService);

  locale = this._appTranslationService.locale;
  productAverageRating = this._ratingService.productAverageRating;
}
