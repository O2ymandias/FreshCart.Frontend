import { Component, DestroyRef, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { GalleriaModule } from 'primeng/galleria';
import { ProductService } from '../../../core/services/product/product.service';
import { SlicePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';

@Component({
  selector: 'app-home-header',
  imports: [GalleriaModule, RouterLink, SlicePipe, TranslatePipe],
  templateUrl: './home-header.component.html',
  styleUrl: './home-header.component.scss',
})
export class HomeHeaderComponent {
  private readonly _productService = inject(ProductService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);

  constructor() {
    effect(() => {
      // Reading currLang Signal
      const lang = this.currLang();
      this._getBrands();
    });
  }

  currLang = this._appTranslationService.currLang;
  brands = this._productService.brands;

  onSelectBrand(brandId: number) {
    this._productService.credentials.set({
      pageSize: this._productService.DEFAULT_PAGE_SIZE,
      pageNumber: this._productService.DEFAULT_PAGE_NUMBER,
      brandId,
    });

    this._router.navigate(['/products']);
  }

  private _getBrands() {
    this._productService
      .getBrands()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
