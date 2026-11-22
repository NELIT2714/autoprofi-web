import { Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { I18n } from '../../i18n/i18n';

interface NavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage],
  templateUrl: './header.html',
})
export class Header {
  protected readonly t = inject(I18n).t;
  protected readonly links: NavLink[] = this.t().header.nav;
  protected readonly open = signal(false);

  protected toggle() {
    this.open.update((v) => !v);
  }

  protected close() {
    this.open.set(false);
  }
}
