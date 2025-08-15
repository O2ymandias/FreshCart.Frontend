import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamicDate',
})
export class DynamicDatePipe implements PipeTransform {
  transform(value: string, locale: 'en-US' | 'ar-EG' = 'en-US'): string {
    const date = new Date(value);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  }
}
