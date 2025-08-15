import { Component, DestroyRef, inject } from '@angular/core';
import { OrderService } from '../../../core/services/order/order.service';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-orders-header',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './orders-header.component.html',
  styleUrl: './orders-header.component.scss',
})
export class OrdersHeaderComponent {
  private readonly _orderService = inject(OrderService);
  private readonly _destroyRef = inject(DestroyRef);

  searchQuery = this._orderService.searchQuery;

  search() {
    const query = this.searchQuery();
    if (!query) {
      this.reset();
      return;
    }

    const orderId = parseInt(query);
    if (isNaN(orderId)) {
      this.reset();
      return;
    }

    this._orderService
      .getOrders({ orderId })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
  reset() {
    this._orderService.reset();
    this._orderService
      .getOrders({ pageNumber: 1 })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
