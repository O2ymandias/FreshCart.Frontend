import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { DynamicNumberPipe } from '../../../shared/pipes/dynamic-number.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-nav-wishlist',
  imports: [TranslatePipe, DynamicNumberPipe],
  templateUrl: './nav-wishlist.component.html',
  styleUrl: './nav-wishlist.component.scss',
})
export class NavWishlistComponent implements OnInit {
  private readonly _wishlistService = inject(WishlistService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _platformId = inject(PLATFORM_ID);

  locale = this._appTranslationService.locale;
  total = this._wishlistService.total;

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._getWishlistItemsTotal();
      this._getWishlistProductIds();
    }
  }

  navigateToWishlist(event: Event) {
    this._router.navigate(['/wishlist']);
    const btn = event.target as HTMLButtonElement;
    btn.blur();
  }

  private _getWishlistProductIds() {
    this._wishlistService
      .getUserWishlistProductIds()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  private _getWishlistItemsTotal() {
    this._wishlistService
      .getTotal()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
