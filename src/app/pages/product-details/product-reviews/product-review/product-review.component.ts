import { Component, computed, inject, input, output } from '@angular/core';
import { IRatingItem } from '../../../../shared/models/rating.model';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { AppTranslationService } from '../../../../core/services/translation/app-translation.service';
import { DynamicDatePipe } from '../../../../shared/pipes/dynamic-date.pipe';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-product-review',
  imports: [Rating, FormsModule, DynamicDatePipe],
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.scss',
})
export class ProductReviewComponent {
  private readonly _authService = inject(AuthService);
  private readonly _appTranslationService = inject(AppTranslationService);

  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  locale = this._appTranslationService.locale;
  ratingItem = input.required<IRatingItem>();
  delete = output<IRatingItem>();
  renderDeleteButton = computed(
    () => this.ratingItem().user.id === this._authService.jwtPayload()?.sub,
  );

  deleteReview() {
    this.delete.emit(this.ratingItem());
  }
}
