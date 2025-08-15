import { NotfoundResourceComponent } from './../../shared/components/notfound-resource/notfound-resource.component';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { ProductService } from '../../core/services/product/product.service';
import { IProduct, IProductGallery } from '../../shared/models/product.model';
import { finalize, tap } from 'rxjs';
import { Image } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '../../core/services/cart/cart.service';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { RatingService } from '../../core/services/rating/rating.service';
import { FormsModule } from '@angular/forms';
import { ProductReviewsComponent } from './product-reviews/product-reviews.component';
import { AverageRatingComponent } from './average-rating/average-rating.component';
import { Title } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../core/services/translation/app-translation.service';
import { DynamicNumberPipe } from '../../shared/pipes/dynamic-number.pipe';
import { AuthService } from '../../core/services/auth/auth.service';
@Component({
  selector: 'app-product-details',
  imports: [
    Image,
    GalleriaModule,
    NotfoundResourceComponent,
    RouterLink,
    FormsModule,
    ProductReviewsComponent,
    AverageRatingComponent,
    TranslatePipe,
    DynamicNumberPipe,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  private readonly _productService = inject(ProductService);
  private readonly _wishlistService = inject(WishlistService);
  private readonly _cartService = inject(CartService);
  private readonly _ratingService = inject(RatingService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _titleService = inject(Title);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _authService = inject(AuthService);

  constructor() {
    effect(() => {
      // Executes whenever currLang signal changes.
      const lang = this.currLang();

      // Executes whenever id signal changes.
      const productId = this.id();

      this.getDetails(productId);
    });
  }

  isAuthenticated = this._authService.isAuthenticated;
  locale = this._appTranslationService.locale;
  currLang = this._appTranslationService.currLang;
  product = signal<IProduct | null>(null);
  id = input.required<number>();
  gallery = signal<IProductGallery[]>([]);
  galleryVisible = signal(false);
  productAverageRating = this._ratingService.productAverageRating;
  productTotalRatings = this._ratingService.productTotalRatings;
  isFavorite = computed(() => {
    return this._wishlistService
      .wishlistProductIds()
      .some((id) => id === this.product()?.id);
  });
  qtyInCart = computed(() => {
    return (
      this._cartService
        .cartItems()
        .find((item) => item.productId.toString() === this.id().toString())
        ?.quantity ?? 0
    );
  });
  cartLoading = signal(false);
  wishlistLoading = signal(false);
  galleryLoading = signal(false);

  getDetails(productId: number) {
    this._productService
      .getProductById(productId)
      .pipe(
        tap((product) => {
          this.product.set(product);
          this._titleService.setTitle(product.name);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
  displayGallery() {
    this.galleryVisible.set(true);
    this.galleryLoading.set(true);
    this._productService
      .getProductGallery(this.id())
      .pipe(
        finalize(() => this.galleryLoading.set(false)),
        tap((res) => this.gallery.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
  addToCart() {
    const product = this.product();
    if (!product) return;

    if (this.cartLoading()) return;

    this.cartLoading.set(true);

    this._cartService
      .addToCart(this.id())
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
      .addToWishlist(this.id())
      .pipe(
        finalize(() => this.wishlistLoading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
  private _deleteFromWishlist() {
    this._wishlistService
      .removeFromWishlist(this.id())
      .pipe(
        finalize(() => this.wishlistLoading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
