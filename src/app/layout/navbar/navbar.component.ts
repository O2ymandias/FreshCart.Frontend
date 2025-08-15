import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavSearchModalComponent } from './nav-search-modal/nav-search-modal.component';
import { FormsModule } from '@angular/forms';
import { NavCartComponent } from './nav-cart/nav-cart.component';
import { NavWishlistComponent } from './nav-wishlist/nav-wishlist.component';
import { NavUserSettingsComponent } from './nav-user-settings/nav-user-settings.component';
import { NavSearchComponent } from './nav-search/nav-search.component';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { CartService } from '../../core/services/cart/cart.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../core/services/translation/app-translation.service';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NavSearchModalComponent,
    FormsModule,
    NavCartComponent,
    NavWishlistComponent,
    NavUserSettingsComponent,
    NavSearchComponent,
    LoadingBarModule,
    TranslatePipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private readonly _cartService = inject(CartService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _authService = inject(AuthService);

  authLayout = input.required<boolean>();
  currLang = this._appTranslationService.currLang;
  isAuthenticated = this._authService.isAuthenticated;

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._getCartItems();
    }
  }

  private _getCartItems() {
    this._cartService
      .getCart()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
