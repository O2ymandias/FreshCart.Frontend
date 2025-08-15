import { AppTranslationService } from './../../../core/services/translation/app-translation.service';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { IProduct } from '../../../shared/models/product.model';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { finalize } from 'rxjs';
import { DynamicNumberPipe } from '../../../shared/pipes/dynamic-number.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-product-card',
  imports: [DynamicNumberPipe, RouterLink, TranslatePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  private readonly _cartService = inject(CartService);
  private readonly _wishlistService = inject(WishlistService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _authService = inject(AuthService);

  isAuthenticated = this._authService.isAuthenticated;
  locale = this._appTranslationService.locale;
  currLang = this._appTranslationService.currLang;
  product = input.required<IProduct>();
  isFavorite = computed(() => {
    return this._wishlistService
      .wishlistProductIds()
      .some((id) => id === this.product().id);
  });
  qtyInCart = computed(() => {
    return (
      this._cartService
        .cartItems()
        .find((item) => item.productId === this.product().id)?.quantity ?? 0
    );
  });
  cartLoading = signal(false);
  wishlistLoading = signal(false);

  addToCart() {
    if (this.cartLoading()) return;
    this.cartLoading.set(true);
    this._cartService
      .addToCart(this.product().id)
      .pipe(
        finalize(() => this.cartLoading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
  addToWishlist() {
    if (this.wishlistLoading()) return;
    this.wishlistLoading.set(true);

    if (this.isFavorite()) {
      this._deleteFromWishlist();
    } else {
      this._addToWishlist();
    }
  }

  private _addToWishlist() {
    this._wishlistService
      .addToWishlist(this.product().id)
      .pipe(
        finalize(() => this.wishlistLoading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
  private _deleteFromWishlist() {
    this._wishlistService
      .removeFromWishlist(this.product().id)
      .pipe(
        finalize(() => this.wishlistLoading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
