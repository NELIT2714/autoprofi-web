import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [NgOptimizedImage],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly year = new Date().getFullYear();

  protected readonly links = [
    { label: 'Продать авто', href: '/sell' },
    { label: 'Купить авто', href: '/buy' },
    { label: 'Этапы работы', href: '/steps' },
    { label: 'Блог', href: '/blog' },
  ];

  protected readonly phones = [{ label: '+380 99 957 34 05', href: 'tel:+380999573405' }];
}
