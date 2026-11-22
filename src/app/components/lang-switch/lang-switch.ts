import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_LANG, I18n, Lang, isLang } from '../../i18n/i18n';

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

  protected options: { code: Lang; short: string; label: string }[] = [
    { code: 'ru', short: 'RU', label: 'Русский' },
    { code: 'uk', short: 'UA', label: 'Українська' },
  ];

  protected pick(code: Lang): void {
    this.open.set(false);
    if (code === this.i18n.lang()) return;

    this.i18n.remember(code);

    const [rest, fragment] = this.router.url.split('#');
    const [path, query] = rest.split('?');
    const segments = path.split('/').filter(Boolean);
    if (isLang(segments[0]) && segments[0] !== DEFAULT_LANG) segments.shift();

    let target = this.i18n.url(segments.join('/'), code);
    if (query) target += '?' + query;
    if (fragment) target += '#' + fragment;

    this.router.navigateByUrl(target);
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
