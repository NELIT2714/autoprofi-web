import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { I18n } from '../../i18n/i18n';

interface FooterLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-footer',
  imports: [NgOptimizedImage],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly i18n = inject(I18n);
  protected readonly t = inject(I18n).t;
  protected readonly year: number = new Date().getFullYear();
  protected readonly phones: FooterLink[] = [
    { label: '+380 99 957 34 05', href: 'tel:+380999573405' },
  ];

  protected readonly mapUrl: string = 'https://maps.app.goo.gl/QSdqrfs5XoodFeEfA';

  protected readonly socials: FooterLink[] = [
    { label: 'Telegram', href: 'https://t.me/...' },
    { label: 'Instagram', href: 'https://instagram.com/...' },
    { label: 'TikTok', href: 'https://tiktok.com/@...' },
  ];
}
