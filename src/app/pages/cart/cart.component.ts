import { DynamicNumberPipe } from './../../shared/pipes/dynamic-number.pipe';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CartService } from '../../core/services/cart/cart.service';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { PaymentSummeryComponent } from '../../shared/components/payment-summery/payment-summery.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { TranslatePipe } from '@ngx-translate/core';
import { NotfoundResourceComponent } from '../../shared/components/notfound-resource/notfound-resource.component';
import { AppTranslationService } from '../../core/services/translation/app-translation.service';
import { map } from 'rxjs';
import { ConfirmationBoxTranslation } from '../../shared/shared.model';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-cart',
  imports: [
    CartItemComponent,
    RouterLink,
    PaymentSummeryComponent,
    CheckoutComponent,
    ModalComponent,
    TranslatePipe,
    AsyncPipe,
    NotfoundResourceComponent,
    DynamicNumberPipe,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly _cartService = inject(CartService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _authService = inject(AuthService);

  constructor() {
    // Skip SSR
    if (isPlatformBrowser(this._platformId)) {
      effect(() => {
        // Executes whenever currLang signal changes.
        const lang = this.currLang();
        this._getCart();
      });
    }
  }

  currLang = this._appTranslationService.currLang;
  locale = this._appTranslationService.locale;
  cartItems = this._cartService.cartItems;
  subTotal = this._cartService.subTotal;
  shippingCost = this._cartService.shippingCost;
  tax = this._cartService.tax;
  total = this._cartService.total;
  checkoutModalVisible = signal(false);
  confirmationBoxTranslation = signal<ConfirmationBoxTranslation>(
    {} as ConfirmationBoxTranslation,
  );
  isAuthenticated = this._authService.isAuthenticated;
  notFoundTranslationMessage$ = this._appTranslationService
    .getTranslation('cart.notFound')
    .pipe(
      map((res) => {
        return {
          title: res.title as string,
          description: res.description as string,
        };
      }),
    );

  ngOnInit(): void {
    this._getConfirmationBoxTranslation();
  }
  showCheckout() {
    this.checkoutModalVisible.set(true);
  }
  clearCart() {
    const { title, message, confirmBtn, cancelBtn } =
      this.confirmationBoxTranslation();
    this._confirmationService.confirm({
      target: event?.target as EventTarget,
      message: message,
      header: title,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: cancelBtn,
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: confirmBtn,
        severity: 'danger',
      },

      accept: () => {
        this._cartService
          .clearCart()
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe();
      },
    });
  }

  private _getCart() {
    this._cartService
      .getCart()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
  private _getConfirmationBoxTranslation() {
    this._appTranslationService
      .getTranslation('confirmationBox.cart')
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((res) => {
        this.confirmationBoxTranslation.set(res);
      });
  }
}
