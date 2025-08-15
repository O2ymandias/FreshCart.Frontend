import { DynamicDatePipe } from './../../../shared/pipes/dynamic-date.pipe';
import { OrderService } from './../../../core/services/order/order.service';
import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { IOrderResult } from '../../../shared/models/orders-model';
import { OrderItemComponent } from './order-item/order-item.component';
import { OrderStatusComponent } from '../order-status/order-status.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { CheckoutService } from '../../../core/services/checkout/checkout.service';
import { TranslatePipe } from '@ngx-translate/core';
import { DynamicNumberPipe } from '../../../shared/pipes/dynamic-number.pipe';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';

@Component({
  selector: 'app-order-card',
  imports: [
    OrderItemComponent,
    OrderStatusComponent,
    TranslatePipe,
    DynamicNumberPipe,
    DynamicDatePipe,
  ],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
})
export class OrderCardComponent {
  private readonly _orderService = inject(OrderService);
  private readonly _checkoutService = inject(CheckoutService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _appTranslationService = inject(AppTranslationService);

  locale = this._appTranslationService.locale;
  order = input.required<IOrderResult>();
  showDetails = output<IOrderResult>();
  canceled = output();

  onShowDetails() {
    this.showDetails.emit(this.order());
  }
  retrieveCheckoutSession(orderId: number) {
    this._checkoutService
      .retrieveCheckoutSession(orderId)
      .pipe(
        tap((res) => (window.location.href = res.redirectUrl)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
  cancelOrder(orderId: number) {
    this._orderService
      .cancelOrder(orderId)
      .pipe(
        tap(() => this.canceled.emit()),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
