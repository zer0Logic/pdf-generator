import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-sm font-medium text-stone-700 mb-1.5',
  },
  template: ` <label [for]="for()">{{ label() }}</label> `,
})
export class LabelComponent {
  label = input.required<string>();
  for = input<string | null>(null);
}
