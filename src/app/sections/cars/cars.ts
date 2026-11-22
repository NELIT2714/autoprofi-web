import { Component, inject } from '@angular/core';
import { I18n } from '../../i18n/i18n';

@Component({
  selector: 'app-cars',
  imports: [],
  templateUrl: './cars.html',
})
export class Cars {
  protected readonly t = inject(I18n).t;
}
