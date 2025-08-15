import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { DynamicNumberPipe } from '../../pipes/dynamic-number.pipe';

@Component({
  selector: 'app-payment-summery',
  imports: [DynamicNumberPipe, TranslatePipe],
  templateUrl: './payment-summery.component.html',
  styleUrl: './payment-summery.component.scss',
})
export class PaymentSummeryComponent {
  private readonly _appTranslationService = inject(AppTranslationService);
  locale = this._appTranslationService.locale;
  subTotal = input.required<number>();
  shippingCost = input.required<number>();
  tax = input.required<number>();
  total = input.required<number>();
}
