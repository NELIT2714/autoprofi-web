import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { ru } from './ru';
import { uk } from './uk';

export type Lang = 'uk' | 'ru';
export const LANGS: Lang[] = ['uk', 'ru'];
export const DEFAULT_LANG: Lang = 'uk';

const DICTIONARIES = { uk, ru };

export function isLang(value: string | null): value is Lang {
  return LANGS.includes(value as Lang);
}

@Injectable({ providedIn: 'root' })
export class I18n {
  private doc = inject(DOCUMENT);
  private browser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly lang = signal<Lang>(DEFAULT_LANG);
  readonly t = computed(() => DICTIONARIES[this.lang()]);

  setLang(lang: Lang): void {
    this.lang.set(lang);
    this.doc.documentElement.lang = lang;
  }

  url(path = '', lang: Lang = this.lang()): string {
    const prefix = lang === DEFAULT_LANG ? '' : lang;
    return '/' + [prefix, path].filter(Boolean).join('/');
  }

  saved(): Lang | null {
    if (!this.browser) return null;
    try {
      const value = localStorage.getItem('lang');
      return isLang(value) ? value : null;
    } catch {
      return null;
    }
  }

  remember(lang: Lang): void {
    if (!this.browser) return;
    try {
      localStorage.setItem('lang', lang);
    } catch {}
  }
}
