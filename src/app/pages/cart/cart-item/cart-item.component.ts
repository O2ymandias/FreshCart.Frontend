import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { RangePipe } from '../../../shared/pipes/range.pipe';
import { ICartItem } from '../../../shared/models/cart.model';
import { ProductService } from '../../../core/services/product/product.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, tap } from 'rxjs';
import { CartService } from '../../../core/services/cart/cart.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { TranslatePipe } from '@ngx-translate/core';
import { DynamicNumberPipe } from '../../../shared/pipes/dynamic-number.pipe';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToasterService } from '../../../core/services/toaster/toaster.service';

@Component({
  selector: 'app-cart-item',
  imports: [
    RangePipe,
    FormsModule,
    RouterLink,
    TranslatePipe,
    DynamicNumberPipe,
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
})
export class CartItemComponent implements OnInit {
  private readonly _productService = inject(ProductService);
  private readonly _wishlistService = inject(WishlistService);
  private readonly _cartService = inject(CartService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _authService = inject(AuthService);
  private readonly _toaster = inject(ToasterService);

  isAuthenticated = this._authService.isAuthenticated;
  locale = this._appTranslationService.locale;
  cartItem = input.required<ICartItem>();
  maxOrderQty = signal<number>(1);
  selectQty = viewChild.required<ElementRef<HTMLSelectElement>>('selectQty');
  isFavorite = computed(() => {
    return this._wishlistService
      .wishlistProductIds()
      .some((id) => id === this.cartItem().productId);
  });
  loading = signal(false);

  ngOnInit(): void {
    this._getMaxOrderQty();
  }
  updateQuantity() {
    this.loading.set(true);
    const newQty = parseFloat(this.selectQty().nativeElement.value);
    this._cartService
      .updateQuantity(this.cartItem().productId, newQty)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
  removeFromCart() {
    this.loading.set(true);
    this._cartService
      .removeFromCart(this.cartItem().productId)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
  addToWishlist() {
    if (this.loading()) return;
    this.loading.set(true);

    if (this.isFavorite()) {
      this._deleteFromWishlist();
    } else {
      this._addToWishlist();
    }
  }
  private _getMaxOrderQty() {
    this._productService
      .getMaxOrderQuantity(this.cartItem().productId)
      .pipe(
        tap((res) => this.maxOrderQty.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
  private _addToWishlist() {
    this._wishlistService
      .addToWishlist(this.cartItem().productId)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
  private _deleteFromWishlist() {
    this._wishlistService
      .removeFromWishlist(this.cartItem().productId)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
