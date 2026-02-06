import { Component, ChangeDetectionStrategy, input, signal, inject, computed } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, of, merge } from 'rxjs';
import { LabelComponent } from './label';
import { FieldErrorComponent } from './field-error';
import { getErrorMessage } from '../../utils/validation-messages';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-select',
  imports: [LabelComponent, FieldErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
  template: `
    @if (label()) {
      <app-label [label]="label()!" [for]="id()" />
    }
    <div class="relative">
      <select
        [id]="id()"
        [value]="value()"
        [disabled]="disabled()"
        (change)="handleChange($event)"
        (blur)="handleBlur()"
        class="h-10 w-full appearance-none rounded-lg border bg-white px-3 pe-10 text-sm transition-all focus:outline-none disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-400"
        [class]="
          isInvalid()
            ? 'border-red-400 ring-red-500 focus:border-red-500 focus:ring-1'
            : 'border-stone-300 ring-lime-600 focus:border-lime-600 focus:ring-1'
        "
      >
        @for (option of options(); track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
    @if (isInvalid() && errorMessage()) {
      <app-field-error [message]="errorMessage()" />
    }
  `,
})
export class SelectComponent implements ControlValueAccessor {
  id = input<string>('select-' + Math.random().toString(36).substring(2, 9));
  label = input<string | null>(null);
  options = input.required<SelectOption[]>();
  customErrors = input<Record<string, string>>({});

  protected value = signal<any>('');
  protected disabled = signal(false);
  protected touched = signal(false);

  readonly ngControl = inject(NgControl, { optional: true, self: true });

  protected status = toSignal(
    merge(this.ngControl?.statusChanges ?? of(null), this.ngControl?.valueChanges ?? of(null)).pipe(
      startWith(this.ngControl?.status),
    ),
    { initialValue: null },
  );

  protected isInvalid = computed(() => {
    this.status();
    this.value();
    const isTouched = this.touched();
    return !!(this.ngControl?.invalid && (isTouched || this.ngControl?.dirty));
  });

  protected errorMessage = computed(() => {
    this.status();
    this.value();
    this.touched();
    return getErrorMessage(this.ngControl?.errors, this.customErrors());
  });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected handleChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  protected handleBlur(): void {
    this.onTouched();
    this.touched.set(true);
  }

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
}
