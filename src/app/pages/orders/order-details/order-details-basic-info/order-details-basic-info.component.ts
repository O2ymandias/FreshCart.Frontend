import { Component, inject, input } from '@angular/core';
import { DynamicDatePipe } from '../../../../shared/pipes/dynamic-date.pipe';
import { DynamicNumberPipe } from '../../../../shared/pipes/dynamic-number.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../../../core/services/translation/app-translation.service';

@Component({
  selector: 'app-order-details-basic-info',
  imports: [DynamicDatePipe, DynamicNumberPipe, TranslatePipe],
  templateUrl: './order-details-basic-info.component.html',
  styleUrl: './order-details-basic-info.component.scss',
})
export class OrderDetailsBasicInfoComponent {
  private readonly _appTranslationService = inject(AppTranslationService);

  locale = this._appTranslationService.locale;
  orderId = input.required<number>();
  orderDate = input.required<string>();
  total = input.required<number>();
}
