import { Component, inject, input } from '@angular/core';
import { IOrderItem } from '../../../../../shared/models/orders-model';
import { RouterLink } from '@angular/router';
import { AppTranslationService } from '../../../../../core/services/translation/app-translation.service';
import { DynamicNumberPipe } from '../../../../../shared/pipes/dynamic-number.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-order-details-order-item',
  imports: [RouterLink, DynamicNumberPipe, TranslatePipe],
  templateUrl: './order-details-order-item.component.html',
  styleUrl: './order-details-order-item.component.scss',
})
export class OrderDetailsOrderItemComponent {
  private readonly _appTranslationService = inject(AppTranslationService);

  locale = this._appTranslationService.locale;
  orderItem = input.required<IOrderItem>();
}
