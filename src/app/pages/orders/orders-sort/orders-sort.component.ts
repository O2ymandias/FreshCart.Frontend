import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderSortSelectOption } from '../../../shared/models/orders-model';
import { OrderService } from '../../../core/services/order/order.service';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-orders-sort',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './orders-sort.component.html',
  styleUrl: './orders-sort.component.scss',
})
export class OrdersSortComponent {
  private readonly _orderService = inject(OrderService);
  private readonly _appTranslationService = inject(AppTranslationService);

  sortOptions: OrderSortSelectOption[] = this._orderService.SORT_OPTIONS;
  currentLang = this._appTranslationService.currLang;
  sort = this._orderService.sort;
}
