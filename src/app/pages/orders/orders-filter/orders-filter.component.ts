import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order/order.service';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-orders-filter',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './orders-filter.component.html',
  styleUrl: './orders-filter.component.scss',
})
export class OrdersFilterComponent {
  private readonly _orderService = inject(OrderService);
  private readonly _appTranslationService = inject(AppTranslationService);

  currentLang = this._appTranslationService.currLang;
  filter = this._orderService.filter;
  filterOptions = this._orderService.FILTER_OPTIONS;

  reset() {
    this._orderService.reset();
  }
}
