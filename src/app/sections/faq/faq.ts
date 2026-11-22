import { Component, inject, signal } from '@angular/core';
import { I18n } from '../../i18n/i18n';

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq.html',
})
export class Faq {
  protected readonly t = inject(I18n).t;
  protected readonly openIndex = signal<number | null>(0);

  protected toggle(index: number) {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
