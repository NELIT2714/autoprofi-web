import { Component, inject, signal } from '@angular/core';
import { I18n } from '../../core/i18n/i18n';
import { RouterLink } from '@angular/router';

const PHONE_HREF = 'tel:+380999573405';
const PHONE_TEXT = '+380 99 957 34 05';
const MAP_URL = 'https://maps.app.goo.gl/QSdqrfs5XoodFeEfA';

@Component({
  selector: 'app-faq',
  imports: [RouterLink],
  templateUrl: './faq.html',
})
export class Faq {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly openIndex = signal<number | null>(0);

  protected readonly phoneHref = PHONE_HREF;
  protected readonly phoneText = PHONE_TEXT;
  protected readonly mapUrl = MAP_URL;

  protected toggle(index: number) {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
