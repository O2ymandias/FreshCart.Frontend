import { Component, DestroyRef, inject, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryCardComponent } from './category-card/category-card.component';
import { ProductService } from '../../../core/services/product/product.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { Carousel } from 'primeng/carousel';

@Component({
  selector: 'app-home-categories',
  imports: [CategoryCardComponent, TranslatePipe, Carousel],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.scss',
})
export class HomeCategoriesComponent {
  private readonly _productService = inject(ProductService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      // Reading currLang Signal
      const lang = this.currLang();
      this._getCategories();
    });
  }

  currLang = this._appTranslationService.currLang;
  categories = this._productService.categories;
  responsiveOptions = [
    {
      breakpoint: '1536px', // 2xl
      numVisible: 5,
      numScroll: 1,
    },
    {
      breakpoint: '1280px', // xl
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: '1024px', // lg
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px', // md
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '640px', // sm
      numVisible: 1,
      numScroll: 1,
    },
  ];

  private _getCategories() {
    this._productService
      .getCategories()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
