import { DynamicNumberPipe } from './../../pipes/dynamic-number.pipe';
import { Component, inject, input, output } from '@angular/core';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-pagination',
  imports: [DynamicNumberPipe, TranslatePipe],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  private readonly _appTranslationService = inject(AppTranslationService);

  currLang = this._appTranslationService.currLang;
  locale = this._appTranslationService.locale;
  totalPages = input.required<number>();
  currPageNumber = input.required<number>();
  hasNext = input.required<boolean>();
  hasPrevious = input.required<boolean>();
  pageChange = output<number>();

  onPageChange(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages()) return;
    this.pageChange.emit(pageNumber);
  }
}
