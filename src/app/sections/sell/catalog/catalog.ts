import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { CARS, Condition } from './catalog.data';
import { I18n } from '../../../core/i18n/i18n';

@Component({
  selector: 'app-catalog',
  imports: [NgOptimizedImage],
  templateUrl: './catalog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Catalog {
  protected readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;

  protected readonly makes = [...new Set(CARS.map((c) => c.make))].sort();
  protected readonly years = [...new Set(CARS.map((c) => c.year))].sort((a, b) => b - a);
  protected readonly conditions: Condition[] = ['good', 'accident', 'repair'];

  protected readonly make = signal('');
  protected readonly year = signal('');
  protected readonly condition = signal('');

  protected readonly cars = computed(() =>
    CARS.filter(
      (c) =>
        (!this.make() || c.make === this.make()) &&
        (!this.year() || c.year === +this.year()) &&
        (!this.condition() || c.condition === this.condition()),
    ),
  );

  protected reset(): void {
    this.make.set('');
    this.year.set('');
    this.condition.set('');
  }

  protected format(value: number): string {
    return value.toLocaleString(this.i18n.lang() === 'uk' ? 'uk-UA' : 'ru-RU');
  }

  protected badge(condition: Condition): string {
    return condition === 'good' ? 'bg-[#171816] text-white' : 'bg-[#FF503A] text-[#171816]';
  }
}
