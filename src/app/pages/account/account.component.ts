import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { AccountNavComponent } from './account-nav/account-nav.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountLatestOrdersComponent } from './account-latest-orders/account-latest-orders.component';
import { RouterLink } from '@angular/router';
import { AccountLatestReviewsComponent } from './account-latest-reviews/account-latest-reviews.component';
import { AccountService } from '../../core/services/account/account.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../core/services/translation/app-translation.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-account',
  imports: [
    AccountNavComponent,
    AccountInfoComponent,
    AccountLatestOrdersComponent,
    RouterLink,
    AccountLatestReviewsComponent,
    TranslatePipe,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  private readonly _accountService = inject(AccountService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _platformId = inject(PLATFORM_ID);

  constructor() {
    // Skipping SSR
    if (isPlatformBrowser(this._platformId)) {
      effect(() => {
        // Execute whenever currLang signal changes.
        const lang = this.currLang();
        this._getUserLatestRatings();
        this._getUserLatestOrders();
      });
    }
  }

  currLang = this._appTranslationService.currLang;
  latestOrdersSection =
    viewChild.required<ElementRef<HTMLDivElement>>('latestOrders');
  latestRatingsSection =
    viewChild.required<ElementRef<HTMLDivElement>>('latestRatings');

  scrollTo(section: 'orders' | 'ratings') {
    if (section === 'orders') {
      this.latestOrdersSection().nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    } else if (section === 'ratings') {
      this.latestRatingsSection().nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }

  private _getUserLatestRatings() {
    this._accountService
      .getLatestRatings()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
  private _getUserLatestOrders() {
    this._accountService
      .getLatestOrders()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
