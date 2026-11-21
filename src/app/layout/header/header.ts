import { Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

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
  protected readonly links: NavLink[] = [
    { label: 'Продать авто', href: '/sell' },
    { label: 'Купить авто', href: '/buy' },
    { label: 'Этапы работы', href: '/steps' },
    { label: 'Блог', href: '/blog' },
  ];

  protected readonly open = signal(false);

  protected toggle() {
    this.open.update((v) => !v);
  }

  protected close() {
    this.open.set(false);
  }
}
