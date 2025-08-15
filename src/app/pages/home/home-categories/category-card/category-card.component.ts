import { Component, inject, input } from '@angular/core';
import { ICategory } from '../../../../shared/models/product.model';
import { ProductService } from '../../../../core/services/product/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-card',
  imports: [],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
})
export class CategoryCardComponent {
  private readonly _productService = inject(ProductService);
  private readonly _router = inject(Router);

  category = input.required<ICategory>();

  onSelectCategory() {
    this._productService.credentials.set({
      pageSize: this._productService.DEFAULT_PAGE_SIZE,
      pageNumber: this._productService.DEFAULT_PAGE_NUMBER,
      categoryId: this.category().id,
    });

    this._router.navigate(['/products']);
  }
}
