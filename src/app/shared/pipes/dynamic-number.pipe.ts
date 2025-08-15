import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamicNumber',
})
export class DynamicNumberPipe implements PipeTransform {
  transform(value: number, locale: 'en-US' | 'ar-EG' = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      useGrouping: false,
    }).format(value);
  }
}
