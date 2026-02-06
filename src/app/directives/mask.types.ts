import { InjectionToken } from '@angular/core';

/**
 * Common interface for all input masking strategies
 */
export interface InputMask {
  /**
   * Transforms a raw string value from the input into a display string and a model value
   */
  transform(rawValue: string): { display: string; model: any };

  /**
   * Formats a model value back into a display string
   */
  format(modelValue: any): string;
}

/**
 * Injection token for masking strategies
 */
export const INPUT_MASK_STRATEGY = new InjectionToken<InputMask>('InputMaskStrategy');
