import { Component, DestroyRef, inject, signal } from '@angular/core';
import { I18n } from '../../i18n/i18n';

@Component({
  selector: 'app-cars',
  imports: [],
  templateUrl: './cars.html',
})
export class Cars {
  protected readonly t = inject(I18n).t;

  protected readonly photos = [
    { src: '/images/cars/1.webp', alt: 'Викуп BMW X5 у Харкові' },
    { src: '/images/cars/2.webp', alt: 'Викуп BMW X5 після ДТП у Харкові' },
    { src: '/images/cars/3.webp', alt: 'Викуп Audi A8 у Харкові' },
    { src: '/images/cars/4.webp', alt: 'Викуп Mazda 6 після ДТП у Харкові' },
    { src: '/images/cars/5.webp', alt: 'Викуп Opel Vectra універсал у Харкові' },
    { src: '/images/cars/6.webp', alt: 'Викуп Ford Mondeo після пошкоджень у Харкові' },
    { src: '/images/cars/7.webp', alt: 'Викуп Hyundai Terracan у Харкові' },
    { src: '/images/cars/8.webp', alt: 'Викуп Nissan Pathfinder після ДТП у Харкові' },
    { src: '/images/cars/9.webp', alt: 'Викуп Fiat Fiorino у Харкові' },
    { src: '/images/cars/10.webp', alt: 'Викуп ВАЗ-2109 у Харкові' },
  ];
  protected readonly current = signal(0);
  private paused = false;

  constructor() {
    const timer = setInterval(() => {
      if (!this.paused) this.next();
    }, 4000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  protected next() {
    this.current.update((i) => (i + 1) % this.photos.length);
  }

  protected prev() {
    this.current.update((i) => (i - 1 + this.photos.length) % this.photos.length);
  }

  protected go(i: number) {
    this.current.set(i);
  }

  protected pause(value: boolean) {
    this.paused = value;
  }
}
