import { Component, inject } from '@angular/core';
import { I18n } from '../../i18n/i18n';

@Component({
  selector: 'app-valuation',
  imports: [],
  templateUrl: './valuation.html'
})
export class Valuation {
  protected t = inject(I18n).t;
}
