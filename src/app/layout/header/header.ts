import { Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18n } from '../../core/i18n/i18n';
import { LangSwitch } from '../../components/lang-switch/lang-switch';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, RouterLink, LangSwitch, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly open = signal(false);

  protected toggle() {
    this.open.update((v) => !v);
  }

  protected close() {
    this.open.set(false);
  }
}
