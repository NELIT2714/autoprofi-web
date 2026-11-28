import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { filter, take } from 'rxjs';
import { DEFAULT_LANG, I18n, Lang, SLUGS, isLang } from '../../core/i18n/i18n';

@Component({
  selector: 'app-lang-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lang-switch.html',
})
export class LangSwitch {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private router = inject(Router);
  protected i18n = inject(I18n);
  protected open = signal(false);

  readonly variant = input<'light' | 'dark'>('light');

  protected options: { code: Lang; short: string; label: string }[] = [
    { code: 'ru', short: 'RU', label: 'Русский' },
    { code: 'uk', short: 'UA', label: 'Українська' },
  ];

  protected pick(code: Lang): void {
    this.open.set(false);
    if (code === this.i18n.lang()) return;

    this.i18n.remember(code);

    const [rest] = this.router.url.split('#');
    const [path, query] = rest.split('?');
    const segments = path.split('/').filter(Boolean);
    if (isLang(segments[0]) && segments[0] !== DEFAULT_LANG) segments.shift();

    const slugs = Object.values(SLUGS).find((s) => s.uk === segments[0] || s.ru === segments[0]);
    if (slugs) segments[0] = slugs[code];

    let target = this.i18n.url(segments.join('/'), code);
    if (query) target += '?' + query;

    const y = window.scrollY;

    this.router.events
      .pipe(
        filter((e): e is Scroll => e instanceof Scroll),
        take(1),
      )
      .subscribe(() => window.scrollTo({ top: y, behavior: 'instant' }));

    this.router.navigateByUrl(target).then(() => {
      window.scrollTo({ top: y, behavior: 'instant' });
    });
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event): void {
    if (!this.host.nativeElement.contains(e.target as Node)) this.open.set(false);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.open.set(false);
  }
}
