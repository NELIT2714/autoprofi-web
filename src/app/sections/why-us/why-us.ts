import { Component, inject } from '@angular/core';
import { I18n } from '../../core/i18n/i18n';

type WhyUsIcon = 'message' | 'clock' | 'wallet' | 'document';

@Component({
  selector: 'app-why-us',
  imports: [],
  templateUrl: './why-us.html',
})
export class WhyUs {
  protected readonly t = inject(I18n).t;
  protected readonly icons: WhyUsIcon[] = ['message', 'clock', 'wallet', 'document'];
}
