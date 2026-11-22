import { Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { I18n } from '../../i18n/i18n';
import { GOOGLE_REVIEWS_URL, REVIEWS_POOL, Review, SHOWN_COUNT } from '../../seo/reviews';

const INTERVAL = 7000;

function pickRandom<T>(items: T[], count: number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, count);
}

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq.html',
})
export class Faq {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly openIndex = signal<number | null>(0);

  protected readonly reviews = signal<Review[]>(REVIEWS_POOL.slice(0, SHOWN_COUNT));
  protected readonly active = signal(0);
  protected readonly ready = signal(false);
  protected readonly reviewsUrl = GOOGLE_REVIEWS_URL;

  private paused = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.reviews.set(pickRandom(REVIEWS_POOL, SHOWN_COUNT));
      this.ready.set(true);

      const timer = setInterval(() => {
        if (!this.paused) this.move(1);
      }, INTERVAL);
      destroyRef.onDestroy(() => clearInterval(timer));
    });
  }

  protected toggle(index: number) {
    this.openIndex.update((current) => (current === index ? null : index));
  }

  protected setPaused(value: boolean): void {
    this.paused = value;
  }

  protected move(direction: 1 | -1): void {
    const total = this.reviews().length;
    if (total < 2) return;
    this.active.update((i) => (i + direction + total) % total);
  }
}
