import {
  Component,
  DestroyRef,
  effect,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '../../product/product-card/product-card.component';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductService } from '../../../core/services/product/product.service';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { IProductOptions } from '../../../shared/models/product.model';

@Component({
  selector: 'app-home-trending-products',
  imports: [ProductCardComponent, SlicePipe, RouterLink, TranslatePipe],
  templateUrl: './home-trending-products.component.html',
  styleUrl: './home-trending-products.component.scss',
})
export class HomeTrendingProductsComponent {
  private readonly _productService = inject(ProductService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      // Reading currLang Signal
      const lang = this.currLang();

      // Reading credentials Signal
      this._getTrendingProducts();
    });
  }

  currLang = this._appTranslationService.currLang;
  products = this._productService.products;

  private _getTrendingProducts() {
    const credentials: IProductOptions = {
      pageNumber: this._productService.DEFAULT_PAGE_NUMBER,
      pageSize: this._productService.DEFAULT_PAGE_SIZE,
    };

    this._productService
      .getProducts(credentials)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
