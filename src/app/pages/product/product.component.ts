import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { ProductService } from '../../core/services/product/product.service';
import { ProductCardComponent } from './product-card/product-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ProductFilterDrawerComponent } from './product-filter-drawer/product-filter-drawer.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { NotfoundResourceComponent } from '../../shared/components/notfound-resource/notfound-resource.component';
import { FormsModule } from '@angular/forms';
import { ProductSortComponent } from './product-sort/product-sort.component';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../core/services/translation/app-translation.service';
import { IProductOptions } from '../../shared/models/product.model';

@Component({
  selector: 'app-product',
  imports: [
    ProductCardComponent,
    PaginationComponent,
    ProductFilterDrawerComponent,
    NotfoundResourceComponent,
    FormsModule,
    ProductSortComponent,
    TranslatePipe,
    AsyncPipe,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  constructor() {
    effect(() => {
      // Reading currLang Signal
      const lang = this.lang();

      // Reading credentials Signal
      const credentials = this.credentials();

      this.updatePage(credentials);
    });
  }

  private readonly _productService = inject(ProductService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _appTranslationService = inject(AppTranslationService);

  lang = this._appTranslationService.currLang;
  locale = this._appTranslationService.locale;
  products = this._productService.products;
  credentials = this._productService.credentials;
  totalPages = signal(1);
  hasNext = signal(false);
  hasPrevious = signal(false);
  currPageNumber = computed<number>(
    () =>
      this.credentials().pageNumber ?? this._productService.DEFAULT_PAGE_NUMBER,
  );
  notFoundTranslationMessage$ = this._appTranslationService
    .getTranslation('products.notFound')
    .pipe(
      map((res) => {
        return {
          title: res.title as string,
          description: res.description as string,
        };
      }),
    );

  updatePage(credentials: IProductOptions): void {
    this._productService
      .getProducts(credentials)
      .pipe(
        tap((res) => {
          this.totalPages.set(res.pages);
          this.hasPrevious.set(res.hasPrevious);
          this.hasNext.set(res.hasNext);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
  onPageChange(pageNumber: number) {
    this.credentials.update((oldVal) => ({
      ...oldVal,
      pageNumber,
    }));
  }
  reset() {
    this._productService.reset();
  }
}
