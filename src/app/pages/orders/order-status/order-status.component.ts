import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { OrderStatus } from '../../../shared/models/orders-model';

@Component({
  selector: 'app-order-status',
  imports: [TranslatePipe],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.scss',
})
export class OrderStatusComponent {
  orderStatus = input.required<OrderStatus>();
}
