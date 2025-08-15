import {
  IOrderOptions,
  IOrderResult,
} from './../../shared/models/orders-model';
import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order/order.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { OrdersHeaderComponent } from './orders-header/orders-header.component';
import { OrdersFilterComponent } from './orders-filter/orders-filter.component';
import { OrdersSortComponent } from './orders-sort/orders-sort.component';
import { OrderCardComponent } from './order-card/order-card.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { isPlatformBrowser } from '@angular/common';
import { NotfoundResourceComponent } from '../../shared/components/notfound-resource/notfound-resource.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../core/services/translation/app-translation.service';

@Component({
  selector: 'app-orders',
  imports: [
    FormsModule,
    OrdersHeaderComponent,
    OrdersFilterComponent,
    OrdersSortComponent,
    OrderCardComponent,
    OrderDetailsComponent,
    NotfoundResourceComponent,
    PaginationComponent,
    ModalComponent,
    TranslatePipe,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  private readonly _orderService = inject(OrderService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      // Execute whenever currLang/sort/filter signal changes.
      effect(() => {
        const lang = this.currLang();

        const options: IOrderOptions = {};
        const sort = this.sort();
        const filter = this.filter();

        if (filter) options.filter = filter;

        if (sort)
          options.sort = {
            key: sort.key,
            dir: sort.dir,
          };

        this._getOrders(options);
      });
    }
  }

  currLang = this._appTranslationService.currLang;
  orders = this._orderService.orders;
  currPageNumber = this._orderService.currPageNumber;
  pageSize = this._orderService.pageSize;
  hasNext = signal(false);
  hasPrevious = signal(false);
  totalPages = signal(0);
  sort = this._orderService.sort;
  filter = this._orderService.filter;
  selectedOrderId = signal(0);
  orderDetailsModal =
    viewChild.required<ElementRef<HTMLDialogElement>>('orderDetailsModal');
  selectedOrder = signal<IOrderResult | null>(null);
  orderDetailsVisible = signal(false);

  showOrderDetails(order: IOrderResult) {
    this.selectedOrder.set(order);
    this.orderDetailsVisible.set(true);
  }
  moveToPage(pageNumber: number) {
    this.currPageNumber.set(pageNumber);
    const sort = this.sort();
    const filter = this.filter();
    const options: IOrderOptions = {
      pageNumber,
      sort,
      filter,
    };

    this._getOrders(options);
  }
  onCancelOrder() {
    const options: IOrderOptions = {
      pageNumber: this.currPageNumber(),
    };

    this._getOrders(options);
  }

  private _getOrders(options: IOrderOptions) {
    this._orderService
      .getOrders(options)
      .pipe(
        tap((res) => {
          this.currPageNumber.set(res.pageNumber);
          this.hasNext.set(res.hasNext);
          this.hasPrevious.set(res.hasPrevious);
          this.totalPages.set(res.pages);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
