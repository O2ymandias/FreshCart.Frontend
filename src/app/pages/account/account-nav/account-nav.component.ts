import { Component, inject, output } from '@angular/core';
import { AccountNavItemComponent } from './account-nav-item/account-nav-item.component';
import { CartService } from '../../../core/services/cart/cart.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../core/services/account/account.service';
import { TranslatePipe } from '@ngx-translate/core';
import { DynamicNumberPipe } from '../../../shared/pipes/dynamic-number.pipe';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';

@Component({
  selector: 'app-account-nav',
  imports: [
    AccountNavItemComponent,
    RouterLink,
    TranslatePipe,
    DynamicNumberPipe,
  ],
  templateUrl: './account-nav.component.html',
  styleUrl: './account-nav.component.scss',
})
export class AccountNavComponent {
  private readonly _accountService = inject(AccountService);
  private readonly _cartServices = inject(CartService);
  private readonly _wishlistService = inject(WishlistService);
  private readonly _appTranslationService = inject(AppTranslationService);

  locale = this._appTranslationService.locale;
  cartCount = this._cartServices.count;
  wishlistCount = this._wishlistService.total;
  ordersCount = this._accountService.userLatestOrdersCount;
  ratingsCount = this._accountService.userLatestRatingsCount;

  scroll = output<'orders' | 'ratings'>();

  scrollTo(section: 'orders' | 'ratings') {
    this.scroll.emit(section);
  }
}
