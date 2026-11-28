import { Component, DestroyRef, inject, signal } from '@angular/core';
import { I18n } from '../../core/i18n/i18n';

@Component({
  selector: 'app-cars',
  imports: [],
  templateUrl: './cars.html',
})
export class Cars {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;

  protected readonly photos = [
    {
      src: '/images/cars/1.webp',
      alt: { uk: 'Викуп BMW X5 у Харкові', ru: 'Выкуп BMW X5 в Харькове' },
    },
    {
      src: '/images/cars/2.webp',
      alt: { uk: 'Викуп BMW X5 після ДТП у Харкові', ru: 'Выкуп BMW X5 после ДТП в Харькове' },
    },
    {
      src: '/images/cars/3.webp',
      alt: { uk: 'Викуп Audi A8 у Харкові', ru: 'Выкуп Audi A8 в Харькове' },
    },
    {
      src: '/images/cars/4.webp',
      alt: { uk: 'Викуп Mazda 6 після ДТП у Харкові', ru: 'Выкуп Mazda 6 после ДТП в Харькове' },
    },
    {
      src: '/images/cars/5.webp',
      alt: {
        uk: 'Викуп Opel Vectra універсал у Харкові',
        ru: 'Выкуп Opel Vectra универсал в Харькове',
      },
    },
    {
      src: '/images/cars/6.webp',
      alt: {
        uk: 'Викуп Ford Mondeo після пошкоджень у Харкові',
        ru: 'Выкуп Ford Mondeo после повреждений в Харькове',
      },
    },
    {
      src: '/images/cars/7.webp',
      alt: { uk: 'Викуп Hyundai Terracan у Харкові', ru: 'Выкуп Hyundai Terracan в Харькове' },
    },
    {
      src: '/images/cars/8.webp',
      alt: {
        uk: 'Викуп Nissan Pathfinder після ДТП у Харкові',
        ru: 'Выкуп Nissan Pathfinder после ДТП в Харькове',
      },
    },
    {
      src: '/images/cars/9.webp',
      alt: { uk: 'Викуп Fiat Fiorino у Харкові', ru: 'Выкуп Fiat Fiorino в Харькове' },
    },
    {
      src: '/images/cars/10.webp',
      alt: { uk: 'Викуп ВАЗ-2109 у Харкові', ru: 'Выкуп ВАЗ-2109 в Харькове' },
    },
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
