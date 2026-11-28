import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { I18n } from '../../../core/i18n/i18n';

@Component({
  selector: 'app-info',
  templateUrl: './info.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Info {
  protected readonly t = inject(I18n).t;
  protected openIndex = signal<number | null>(null);

  protected toggle(i: number): void {
    this.openIndex.update((cur) => (cur === i ? null : i));
  }
}
