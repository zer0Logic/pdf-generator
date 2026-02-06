import { Component, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="w-[min(90vw,420px)] rounded-xl bg-white p-6 shadow-2xl">
      <div class="mb-4 flex items-center gap-3">
        <div
          [class]="variantClasses[data.variant || 'info'].iconBg"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        >
          <svg
            [class]="variantClasses[data.variant || 'info'].iconText"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-stone-900">{{ data.title }}</h3>
      </div>

      <p class="mb-6 text-sm leading-relaxed text-stone-500">
        {{ data.message }}
      </p>

      <div class="flex justify-end gap-3">
        <button
          (click)="dialogRef.close(false)"
          class="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
        >
          {{ data.cancelText || 'Batal' }}
        </button>
        <button
          (click)="dialogRef.close(true)"
          [class]="variantClasses[data.variant || 'info'].buttonBg"
          class="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all active:scale-95"
        >
          {{ data.confirmText || 'Ya, Lanjutkan' }}
        </button>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(DialogRef<boolean>);
  readonly data = inject<ConfirmDialogData>(DIALOG_DATA);

  protected readonly variantClasses = {
    danger: {
      iconBg: 'bg-red-50',
      iconText: 'text-red-600',
      buttonBg: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      iconBg: 'bg-amber-50',
      iconText: 'text-amber-600',
      buttonBg: 'bg-amber-600 hover:bg-amber-700',
    },
    info: {
      iconBg: 'bg-lime-50',
      iconText: 'text-lime-600',
      buttonBg: 'bg-lime-600 hover:bg-lime-700',
    },
  };
}
