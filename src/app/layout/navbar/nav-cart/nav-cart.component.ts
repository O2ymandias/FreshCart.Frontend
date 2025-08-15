import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { DynamicNumberPipe } from '../../../shared/pipes/dynamic-number.pipe';

@Component({
  selector: 'app-nav-cart',
  imports: [TranslatePipe, DynamicNumberPipe],
  templateUrl: './nav-cart.component.html',
  styleUrl: './nav-cart.component.scss',
})
export class NavCartComponent {
  private readonly _cartService = inject(CartService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _router = inject(Router);

  locale = this._appTranslationService.locale;
  subTotal = this._cartService.subTotal;
  count = this._cartService.count;

  navigateToCart(event: Event) {
    this._router.navigate(['/cart']);
    const btn = event.target as HTMLButtonElement;
    btn.blur();
  }
}
