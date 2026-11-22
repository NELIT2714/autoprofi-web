import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
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
}
