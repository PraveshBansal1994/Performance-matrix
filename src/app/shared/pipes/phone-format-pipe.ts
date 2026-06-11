import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    const digits = value.split(' ')[1].replace(/\D/g, '');

    // Format as (123) 456-7890
    const areaCode = digits.substring(0, 3);
    const middle = digits.substring(3, 6);
    const last = digits.substring(6);

    return `${value.split(' ')[0]} (${areaCode}) ${middle}-${last}`;
  }
}
