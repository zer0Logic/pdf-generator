import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonColor = 'primary' | 'danger' | 'secondary';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon-md';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button [type]="type()" [disabled]="disabled()" [class]="classes()">
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  variant = input<ButtonVariant>('solid');
  color = input<ButtonColor>('primary');
  size = input<ButtonSize>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);

  protected classes = computed(() => {
    const base =
      'inline-flex items-center justify-center font-medium transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 active:scale-95';

    const variants: Record<ButtonVariant, Record<ButtonColor, string>> = {
      solid: {
        primary: 'bg-lime-600 text-white hover:bg-lime-700 font-semibold',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        secondary: 'bg-stone-600 text-white hover:bg-stone-700',
      },
      outline: {
        primary: 'border border-lime-200 text-lime-600 hover:bg-lime-50 bg-white',
        danger: 'border border-red-200 text-red-600 hover:bg-red-50 bg-white',
        secondary: 'border border-stone-200 text-stone-600 hover:bg-stone-50 bg-white',
      },
      ghost: {
        primary: 'text-lime-600 hover:bg-lime-50',
        danger: 'text-red-600 hover:bg-red-50',
        secondary: 'text-stone-400 hover:bg-stone-100 hover:text-stone-600',
      },
    };

    const sizes: Record<ButtonSize, string> = {
      xs: 'px-2 py-1 text-xs rounded-md',
      sm: 'px-3 py-1.5 text-xs rounded-lg',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-6 py-2 text-base rounded-lg',
      'icon-sm': 'h-8 w-8 rounded-lg',
      'icon-md': 'h-10 w-10 rounded-lg',
    };

    return `${base} ${variants[this.variant()][this.color()]} ${sizes[this.size()]}`;
  });
}
