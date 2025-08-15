import { Component, DestroyRef, inject } from '@angular/core';
import { ProductService } from '../../../core/services/product/product.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';

@Component({
  selector: 'app-product-filter-drawer',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './product-filter-drawer.component.html',
  styleUrl: './product-filter-drawer.component.scss',
})
export class ProductFilterDrawerComponent {
  private readonly _productService = inject(ProductService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _destroyRef = inject(DestroyRef);

  currLang = this._appTranslationService.currLang;
  brands = this._productService.brands;
  categories = this._productService.categories;
  filtrationForm = new FormGroup({
    search: new FormControl<string | null>(null),
    categoryId: new FormControl<number | null>(null),
    brandId: new FormControl<number | null>(null),
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
  });

  onFilter() {
    const { brandId, categoryId, maxPrice, minPrice, search } =
      this.filtrationForm.value;

    this._productService.credentials.set({
      pageSize: this._productService.DEFAULT_PAGE_SIZE,
      pageNumber: this._productService.DEFAULT_PAGE_NUMBER,
      brandId: brandId ?? undefined,
      categoryId: categoryId ?? undefined,
      maxPrice: maxPrice ?? undefined,
      minPrice: minPrice ?? undefined,
      search: search ?? undefined,
    });
  }
  onResetFilters() {
    this.filtrationForm.reset();
  }
  initBrandsAndCategories() {
    this._getBrands();
    this._getCategories();
  }

  private _getBrands() {
    this._productService
      .getBrands()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
  private _getCategories() {
    this._productService
      .getCategories()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
