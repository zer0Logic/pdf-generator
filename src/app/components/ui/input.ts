import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  inject,
  computed,
  effect,
  untracked,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, of, merge } from 'rxjs';
import { LabelComponent } from './label';
import { FieldErrorComponent } from './field-error';
import { CurrencyMaskDirective } from '../../directives/currency-mask.directive';
import { PhoneMaskDirective } from '../../directives/phone-mask.directive';
import { InputMask } from '../../directives/mask.types';
import { getErrorMessage } from '../../utils/validation-messages';

@Component({
  selector: 'app-input',
  imports: [LabelComponent, FieldErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: CurrencyMaskDirective,
      inputs: ['mask'],
    },
    {
      directive: PhoneMaskDirective,
      inputs: ['mask'],
    },
  ],
  host: {
    class: 'block w-full',
  },
  template: `
    @if (label()) {
      <app-label [label]="label()!" [for]="id()" />
    }
    <div class="relative flex items-center">
      @if (prefix()) {
        <span class="absolute left-3 text-stone-500">{{ prefix() }}</span>
      }
      <input
        [id]="id()"
        [type]="type()"
        [placeholder]="placeholder()"
        [value]="value()"
        [disabled]="disabled()"
        (input)="handleInput($event)"
        (blur)="handleBlur()"
        class="h-10 w-full rounded-lg border bg-white px-3 text-sm transition-all focus:outline-none disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-400"
        [class.ps-10]="prefix()"
        [class.pe-10]="suffix()"
        [class]="
          isInvalid() ? 'border-red-400 ring-red-500' : 'border-stone-300 focus:border-lime-600'
        "
      />
      @if (suffix()) {
        <span class="absolute right-3 text-stone-500">{{ suffix() }}</span>
      }
    </div>
    @if (isInvalid() && errorMessage()) {
      <app-field-error [message]="errorMessage()" />
    }
  `,
})
export class InputComponent implements ControlValueAccessor {
  id = input<string>('input-' + Math.random().toString(36).substring(2, 9));
  label = input<string | null>(null);
  type = input<string>('text');
  placeholder = input<string>('');
  prefix = input<string | null>(null);
  suffix = input<string | null>(null);
  mask = input<string | null>(null); // Expose mask input on the component
  customErrors = input<Record<string, string>>({});

  protected value = signal<any>('');
  protected disabled = signal(false);
  protected touched = signal(false);

  readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly currencyMask = inject(CurrencyMaskDirective);
  private readonly phoneMask = inject(PhoneMaskDirective);

  // Bridge control status and value changes to a Signal for maximum reactivity
  protected status = toSignal(
    merge(this.ngControl?.statusChanges ?? of(null), this.ngControl?.valueChanges ?? of(null)).pipe(
      startWith(this.ngControl?.status),
    ),
    { initialValue: null },
  );

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    // Sync local touched signal with NgControl (e.g., on form reset)
    effect(() => {
      this.status(); // Pulse
      const ctrl = this.ngControl?.control;
      // If control is reset, also reset our local touched "blur" intent
      if (ctrl && !ctrl.touched && !ctrl.dirty && this.touched()) {
        untracked(() => this.touched.set(false));
      }
    });
  }

  protected isInvalid = computed(() => {
    const ctrl = this.ngControl?.control;
    if (!ctrl || !ctrl.invalid) return false;

    // Dependencies to trigger re-calculation
    this.status();
    this.value();
    const touched = this.touched();

    // Show error if the control is dirty OR touched (locally or via NgControl)
    return ctrl.dirty || ctrl.touched || touched;
  });

  protected errorMessage = computed(() => {
    this.status(); // Recalculate on status/value changes
    this.value();
    this.touched(); // Ensure reactivity on blur
    return getErrorMessage(this.ngControl?.errors, this.customErrors());
  });

  writeValue(value: any): void {
    const formatted = this.activeMask()?.format(value) ?? value ?? '';
    this.value.set(formatted);
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

  protected handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const strategy = this.activeMask();

    if (strategy) {
      const { display, model } = strategy.transform(input.value);
      input.value = display;
      this.value.set(display);
      this.onChange(model);
    } else {
      this.value.set(input.value);
      this.onChange(input.value);
    }
  }

  protected readonly activeMask = computed<InputMask | null>(() => {
    const type = this.mask();
    if (type === 'currency') return this.currencyMask;
    if (type === 'phone') return this.phoneMask;
    return null;
  });

  protected handleBlur(): void {
    this.onTouched();
    this.touched.set(true);
  }

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
}
