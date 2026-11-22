import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { I18n } from '../../i18n/i18n';

@Component({
  selector: 'app-footer',
  imports: [NgOptimizedImage],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly t = inject(I18n).t;
  protected readonly year = new Date().getFullYear();
  protected readonly phones = [{ label: '+380 99 957 34 05', href: 'tel:+380999573405' }];
}
