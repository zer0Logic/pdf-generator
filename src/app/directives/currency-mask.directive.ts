import { Directive, input } from '@angular/core';
import { InputMask, INPUT_MASK_STRATEGY } from './mask.types';

@Directive({
  selector: '[appCurrencyMask]',
  standalone: true,
  providers: [{ provide: INPUT_MASK_STRATEGY, useExisting: CurrencyMaskDirective }],
})
export class CurrencyMaskDirective implements InputMask {
  /**
   * Type of mask to apply. Only activates if value is 'currency'.
   */
  mask = input<string | null>(null);

  transform(rawValue: string): { display: string; model: any } {
    if (this.mask() !== 'currency') {
      return { display: rawValue, model: rawValue };
    }

    // 1. Strip non-digits
    let numericString = rawValue.replace(/\D/g, '');

    // 2. Remove leading zeros
    if (numericString.length > 1 && numericString.startsWith('0')) {
      numericString = numericString.replace(/^0+/, '');
      if (!numericString) numericString = '0';
    }

    if (!numericString) {
      return { display: '', model: null };
    }

    const numericValue = Number(numericString);
    const formatted = new Intl.NumberFormat('id-ID').format(numericValue);

    return {
      display: formatted,
      model: numericValue,
    };
  }

  format(modelValue: any): string {
    if (this.mask() === 'currency' && modelValue !== null && modelValue !== undefined) {
      return new Intl.NumberFormat('id-ID').format(Number(modelValue));
    }
    return modelValue ?? '';
  }
}
