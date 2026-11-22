import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { I18n } from '../../i18n/i18n';
import { MAP_URL, PHONES, SOCIALS } from '../../seo/site';
import { LangSwitch } from '../../components/lang-switch/lang-switch';

@Component({
  selector: 'app-footer',
  imports: [NgOptimizedImage, RouterLink, LangSwitch],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly year: number = new Date().getFullYear();
  protected readonly phones = PHONES;
  protected readonly socials = SOCIALS;
  protected readonly mapUrl = MAP_URL;
}
