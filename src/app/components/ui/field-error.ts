import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { NgControl } from '@angular/forms';

const DEFAULT_ERRORS: Record<string, string> = {
  required: 'Field wajib diisi!',
  minlength: 'Minimal {{requiredLength}} karakter!',
  maxlength: 'Maksimal {{requiredLength}} karakter!',
  email: 'Format email tidak valid!',
  pattern: 'Format tidak valid!',
  nominal: 'Nominal tidak valid!',
};

@Component({
  selector: 'app-field-error',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-xs text-red-500 mt-1',
  },
  template: `
    @if (message()) {
      <span>{{ message() }}</span>
    }
  `,
})
export class FieldErrorComponent {
  message = input<string | null>(null);
}
