import { Component, inject } from '@angular/core';
import { I18n } from '../../i18n/i18n';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-details',
  imports: [RouterLink],
  templateUrl: './details.html',
})
export class Details {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
}
