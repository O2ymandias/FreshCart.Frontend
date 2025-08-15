import { Component, inject, input } from '@angular/core';
import { OrderDetailsOrderItemComponent } from './order-details-order-item/order-details-order-item.component';
import { IOrderItem } from '../../../../shared/models/orders-model';
import { DynamicNumberPipe } from '../../../../shared/pipes/dynamic-number.pipe';
import { AppTranslationService } from '../../../../core/services/translation/app-translation.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-order-details-order-items',
  imports: [OrderDetailsOrderItemComponent, DynamicNumberPipe, TranslatePipe],
  templateUrl: './order-details-order-items.component.html',
  styleUrl: './order-details-order-items.component.scss',
})
export class OrderDetailsOrderItemsComponent {
  private readonly _appTranslationService = inject(AppTranslationService);

  locale = this._appTranslationService.locale;
  orderItems = input.required<IOrderItem[]>();
  subTotal = input.required<number>();
}
