import { Directive, input } from '@angular/core';
import { InputMask, INPUT_MASK_STRATEGY } from './mask.types';

@Directive({
  selector: '[appPhoneMask]',
  standalone: true,
  providers: [{ provide: INPUT_MASK_STRATEGY, useExisting: PhoneMaskDirective }],
})
export class PhoneMaskDirective implements InputMask {
  /**
   * Type of mask to apply. Only activates if value is 'phone'.
   */
  mask = input<string | null>(null);

  transform(rawValue: string): { display: string; model: string | null } {
    if (this.mask() !== 'phone') {
      return { display: rawValue, model: rawValue };
    }

    // 1. Strip non-digits
    let digits = rawValue.replace(/\D/g, '');

    // 2. Format as XXXX-XXXX-XXXX
    let formatted = '';
    if (digits.length > 0) {
      const parts = [];
      for (let i = 0; i < digits.length && i < 13; i += 4) {
        parts.push(digits.substring(i, Math.min(i + 4, 13)));
      }
      formatted = parts.join('-');
    }

    return {
      display: formatted,
      model: digits,
    };
  }

  format(modelValue: any): string {
    if (this.mask() === 'phone' && modelValue) {
      return this.transform(String(modelValue)).display;
    }
    return modelValue ?? '';
  }
}
