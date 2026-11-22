import { Component, inject } from '@angular/core';
import { I18n } from '../../i18n/i18n';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html'
})
export class Hero {
  protected readonly t = inject(I18n).t;
}
