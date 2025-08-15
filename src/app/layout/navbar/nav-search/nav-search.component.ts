import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product/product.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-search',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './nav-search.component.html',
  styleUrl: './nav-search.component.scss',
})
export class NavSearchComponent {
  private readonly _router = inject(Router);
  private readonly _productService = inject(ProductService);

  search = this._productService.search;

  onSearch() {
    const search = this.search()?.trim();
    if (!search) return;

    this._productService.credentials.set({
      pageNumber: this._productService.DEFAULT_PAGE_NUMBER,
      pageSize: this._productService.DEFAULT_PAGE_SIZE,
      search,
    });
    this._router.navigate(['/products']);
    this._productService.resetSort();
    this._productService.resetSearch();
  }
}
