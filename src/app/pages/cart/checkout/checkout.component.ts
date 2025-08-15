import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  computed,
  effect,
  PLATFORM_ID,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CheckoutService } from '../../../core/services/checkout/checkout.service';
import { IDeliveryMethod } from '../../../shared/models/checkout.model';
import { switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderService } from '../../../core/services/order/order.service';
import { isPlatformBrowser } from '@angular/common';
import { PaymentSummeryComponent } from '../../../shared/components/payment-summery/payment-summery.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { IUserShippingAddress } from '../../../shared/models/auth-model';
import { IOrderInput } from '../../../shared/models/orders-model';
import { CartService } from '../../../core/services/cart/cart.service';
import { TranslatePipe } from '@ngx-translate/core';
import { DynamicNumberPipe } from '../../../shared/pipes/dynamic-number.pipe';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { AccountService } from '../../../core/services/account/account.service';

@Component({
  selector: 'app-checkout',
  imports: [
    ReactiveFormsModule,
    PaymentSummeryComponent,
    TranslatePipe,
    DynamicNumberPipe,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  private readonly _cartService = inject(CartService);
  private readonly _checkoutService = inject(CheckoutService);
  private readonly _orderService = inject(OrderService);
  private readonly _authService = inject(AuthService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _accountService = inject(AccountService);

  constructor() {
    // Executes whenever userShippingAddress/freeDeliveryMethodId signals change.
    effect(() => {
      const shippingAddress = this.userShippingAddress();
      const freeDeliveryMethodId = this.freeDeliveryMethodId();

      this.checkoutForm.patchValue({
        shippingAddress: {
          ...shippingAddress,
        },
        deliveryMethod: freeDeliveryMethodId,
      });
    });

    // Executes whenever currLang signal changes.
    effect(() => {
      const lang = this.currLang();
      this._getDeliveryMethods();
    });
  }

  currLang = this._appTranslationService.currLang;
  locale = this._appTranslationService.locale;
  deliveryMethods = signal<IDeliveryMethod[]>([]);
  userShippingAddress = signal<IUserShippingAddress | null>(null);
  freeDeliveryMethodId = computed(
    () => this.deliveryMethods().find((d) => d.cost === 0)?.id,
  );
  checkoutForm = this._createCheckoutForm();
  subTotal = this._cartService.subTotal;
  shippingCost = this._cartService.shippingCost;
  tax = this._cartService.tax;
  total = this._cartService.total;

  ngOnInit(): void {
    this._getUserAddress();
    this._setShippingCost();
  }
  checkout() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const { deliveryMethod, paymentMethod, shippingAddress } =
      this.checkoutForm.value;

    if (!deliveryMethod || !paymentMethod || !shippingAddress) return;

    const { recipientName, street, city, country, phoneNumber } =
      shippingAddress;

    if (!recipientName || !street || !city || !country || !phoneNumber) return;

    const orderInput: IOrderInput = {
      cartId: this._cartService.cartId(),
      deliveryMethodId: deliveryMethod,
      paymentMethod,
      shippingAddress: {
        recipientName,
        phoneNumber,
        street,
        city,
        country,
      },
    };

    this._orderService
      .createOrder(orderInput)
      .pipe(
        switchMap((res) => {
          return this._checkoutService.checkout(res.createdOrderId).pipe(
            tap((res) => {
              if (res.redirectUrl) window.location.href = res.redirectUrl;
            }),
          );
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _createCheckoutForm() {
    return new FormGroup({
      shippingAddress: new FormGroup({
        recipientName: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),

        phoneNumber: new FormControl('', [
          Validators.required,
          Validators.pattern(/^01[0125][0-9]{8}$/),
        ]),

        street: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),

        city: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),

        country: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),
      }),

      paymentMethod: new FormControl('online', [Validators.required]),

      deliveryMethod: new FormControl(0, [Validators.required]),
    });
  }
  private _getUserAddress() {
    if (isPlatformBrowser(this._platformId)) {
      this._accountService
        .getUserAddress()
        .pipe(
          tap((res) => this.userShippingAddress.set(res)),
          takeUntilDestroyed(this._destroyRef),
        )
        .subscribe();
    }
  }
  private _getDeliveryMethods() {
    this._orderService
      .getDeliveryMethods()
      .pipe(
        tap((res) => this.deliveryMethods.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
  private _setShippingCost() {
    this.checkoutForm.controls.deliveryMethod.valueChanges
      .pipe(
        tap({
          next: (deliveryMethodId) => {
            const cost = this.deliveryMethods().find(
              (d) => d.id === deliveryMethodId,
            )?.cost;

            if (cost !== undefined) this.shippingCost.set(cost);
          },
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
