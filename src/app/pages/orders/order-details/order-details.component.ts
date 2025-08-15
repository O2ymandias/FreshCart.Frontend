import { Component, input } from '@angular/core';
import { OrderStatusComponent } from '../order-status/order-status.component';
import { PaymentSummeryComponent } from '../../../shared/components/payment-summery/payment-summery.component';
import { OrderDetailsShippingInfoComponent } from './order-details-shipping-info/order-details-shipping-info.component';
import { OrderDetailsOrderItemsComponent } from './order-details-order-items/order-details-order-items.component';
import { IOrderResult } from '../../../shared/models/orders-model';
import { OrderDetailsBasicInfoComponent } from './order-details-basic-info/order-details-basic-info.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-order-details',
  imports: [
    OrderStatusComponent,
    PaymentSummeryComponent,
    OrderDetailsShippingInfoComponent,
    OrderDetailsOrderItemsComponent,
    OrderDetailsBasicInfoComponent,
    TranslatePipe,
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent {
  order = input.required<IOrderResult>();
}
