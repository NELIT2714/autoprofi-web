import { Component, inject } from '@angular/core';
import { I18n } from '../../core/i18n/i18n';

interface Step {
  title: string;
  text: string;
}

@Component({
  selector: 'app-steps',
  imports: [],
  templateUrl: './steps.html',
})
export class Steps {
  protected readonly t = inject(I18n).t;
}
