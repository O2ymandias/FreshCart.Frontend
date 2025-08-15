import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NotfoundResourceComponent } from '../../../shared/components/notfound-resource/notfound-resource.component';
import { OrderCardComponent } from '../../orders/order-card/order-card.component';
import { OrderDetailsComponent } from '../../orders/order-details/order-details.component';
import { IOrderResult } from '../../../shared/models/orders-model';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { AccountService } from '../../../core/services/account/account.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-account-latest-orders',
  imports: [
    NotfoundResourceComponent,
    OrderCardComponent,
    OrderDetailsComponent,
    ModalComponent,
    TranslatePipe,
  ],
  templateUrl: './account-latest-orders.component.html',
  styleUrl: './account-latest-orders.component.scss',
})
export class AccountLatestOrdersComponent {
  private readonly _accountService = inject(AccountService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _destroyRef = inject(DestroyRef);

  currLang = this._appTranslationService.currLang;
  latestOrders = this._accountService.userLatestOrders;
  latestOrdersCount = this._accountService.userLatestOrdersCount;
  orderDetailsVisible = signal<boolean>(false);
  selectedOrder = signal<IOrderResult | null>(null);

  showOrderDetails(order: IOrderResult) {
    this.selectedOrder.set(order);
    this.orderDetailsVisible.set(true);
  }
  onCancelOrder() {
    // Refresh latest orders
    this._accountService
      .getLatestOrders()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
