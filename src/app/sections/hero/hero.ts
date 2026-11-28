import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n/i18n';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './hero.html',
})
export class Hero {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
}
