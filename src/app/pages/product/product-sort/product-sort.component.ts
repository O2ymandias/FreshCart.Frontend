import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductSortSelectOption } from '../../../shared/models/product.model';
import { ProductService } from '../../../core/services/product/product.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';

@Component({
  selector: 'app-product-sort',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './product-sort.component.html',
  styleUrl: './product-sort.component.scss',
})
export class ProductSortComponent {
  private readonly _productService = inject(ProductService);
  private readonly _appTranslationService = inject(AppTranslationService);

  constructor() {
    effect(() => {
      const sortKey = this.sort()?.key;
      const sortDir = this.sort()?.dir;

      if (sortKey || sortDir) {
        this._productService.credentials.update((oldVal) => ({
          ...oldVal,
          pageNumber: this._productService.DEFAULT_PAGE_NUMBER,
          pageSize: this._productService.DEFAULT_PAGE_SIZE,
          sortKey,
          sortDir,
        }));
      }
    });
  }

  sort = this._productService.sort;
  sortOptions: ProductSortSelectOption[] = [
    {
      key: 'name',
      dir: 'asc',
      label: {
        en: 'Name: From A to Z',
        ar: 'الاسم: من الألف إلى الياء',
      },
    },
    {
      key: 'name',
      dir: 'desc',
      label: {
        en: 'Name: From Z to A',
        ar: 'الاسم: من الياء إلى الألف',
      },
    },
    {
      key: 'price',
      dir: 'asc',
      label: {
        en: 'Price: From low to High',
        ar: 'السعر: من الأقل إلى الأكثر',
      },
    },
    {
      key: 'price',
      dir: 'desc',
      label: {
        en: 'Price: From high to Low',
        ar: 'السعر: من الأكثر إلى الأقل',
      },
    },
  ];
  currLang = this._appTranslationService.currLang;
}
