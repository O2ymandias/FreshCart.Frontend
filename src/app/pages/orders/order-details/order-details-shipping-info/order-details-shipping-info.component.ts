import {
  PaymentMethod,
  PaymentStatus,
} from './../../../../shared/models/orders-model';
import { Component, inject, input } from '@angular/core';
import { IUserShippingAddress } from '../../../../shared/models/auth-model';
import { AppTranslationService } from '../../../../core/services/translation/app-translation.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-order-details-shipping-info',
  imports: [TranslatePipe],
  templateUrl: './order-details-shipping-info.component.html',
  styleUrl: './order-details-shipping-info.component.scss',
})
export class OrderDetailsShippingInfoComponent {
  private readonly _appTranslationService = inject(AppTranslationService);

  locale = this._appTranslationService.locale;
  shippingAddress = input.required<IUserShippingAddress>();
  paymentMethod = input.required<PaymentMethod>();
  paymentStatus = input.required<PaymentStatus>();
}
