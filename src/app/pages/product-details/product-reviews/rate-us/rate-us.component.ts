import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Rating } from 'primeng/rating';
import { RatingService } from '../../../../core/services/rating/rating.service';
import { IRatingInput } from '../../../../shared/models/rating.model';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-rate-us',
  imports: [Rating, ReactiveFormsModule, TranslatePipe],
  templateUrl: './rate-us.component.html',
  styleUrl: './rate-us.component.scss',
})
export class RateUsComponent {
  private readonly _ratingService = inject(RatingService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _authService = inject(AuthService);

  constructor() {
    effect(() => {
      this.rateForm.reset();
      const userRating = this.userRating();
      if (userRating) {
        const { stars, title, comment } = userRating;
        this.rateForm.patchValue({
          stars,
          title,
          comment,
        });
      }
    });
  }

  rateUsModal =
    viewChild.required<ElementRef<HTMLDialogElement>>('rateUsModal');
  productId = input.required<number>();
  jwtPayload = this._authService.jwtPayload;
  productRatings = this._ratingService.productRatings;
  userRating = computed(() =>
    this.productRatings().find((r) => r.user.id === this.jwtPayload()?.sub),
  );
  isAuthenticated = this._authService.isAuthenticated;
  rateForm = new FormGroup({
    stars: new FormControl(0, [
      Validators.required,
      Validators.min(1),
      Validators.max(5),
    ]),
    title: new FormControl('', [Validators.maxLength(50)]),
    comment: new FormControl('', [Validators.maxLength(500)]),
  });
  rateLoading = signal(false);

  showRateUsModal() {
    this.rateUsModal().nativeElement.showModal();
  }
  closeRateUsModal() {
    this.rateUsModal().nativeElement.close();
  }
  rate() {
    if (this.rateForm.invalid) {
      this.rateForm.markAllAsTouched();
      return;
    }

    if (this.rateLoading()) return;

    this.rateLoading.set(true);

    const { stars, title, comment } = this.rateForm.value;

    const rating: IRatingInput = {
      stars: stars!,
      title: title ?? undefined,
      comment: comment ?? undefined,
      productId: this.productId(),
    };

    this._ratingService
      .addRating(rating, this.productId())
      .pipe(
        tap({
          next: () => {
            this.rateLoading.set(false);
            this.closeRateUsModal();
            this.rateForm.reset();
          },
          error: () => this.rateLoading.set(false),
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
