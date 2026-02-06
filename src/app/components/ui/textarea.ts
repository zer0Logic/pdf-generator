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
import { getErrorMessage } from '../../utils/validation-messages';

@Component({
  selector: 'app-textarea',
  imports: [LabelComponent, FieldErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
  template: `
    @if (label()) {
      <app-label [label]="label()!" [for]="id()" />
    }
    <textarea
      [id]="id()"
      [placeholder]="placeholder()"
      [value]="value()"
      [disabled]="disabled()"
      [rows]="rows()"
      (input)="handleInput($event)"
      (blur)="handleBlur()"
      class="w-full rounded-lg border bg-white px-3 py-2 text-sm transition-all focus:outline-none disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-400"
      [class]="
        isInvalid() ? 'border-red-400 ring-red-500' : 'border-stone-300 focus:border-lime-600'
      "
    ></textarea>
    @if (isInvalid() && errorMessage()) {
      <app-field-error [message]="errorMessage()" />
    }
  `,
})
export class TextareaComponent implements ControlValueAccessor {
  id = input<string>('textarea-' + Math.random().toString(36).substring(2, 9));
  label = input<string | null>(null);
  placeholder = input<string>('');
  rows = input<number>(4);
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

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    // Sync local touched signal with NgControl (e.g., on form reset)
    effect(() => {
      this.status();
      const ctrl = this.ngControl?.control;
      if (ctrl && !ctrl.touched && !ctrl.dirty && this.touched()) {
        untracked(() => this.touched.set(false));
      }
    });
  }

  protected isInvalid = computed(() => {
    const ctrl = this.ngControl?.control;
    if (!ctrl || !ctrl.invalid) return false;

    this.status();
    this.value();
    const touched = this.touched();

    return ctrl.dirty || ctrl.touched || touched;
  });

  protected errorMessage = computed(() => {
    this.status();
    this.value();
    this.touched();
    return getErrorMessage(this.ngControl?.errors, this.customErrors());
  });

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

  protected handleInput(event: Event): void {
    const val = (event.target as HTMLTextAreaElement).value;
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
