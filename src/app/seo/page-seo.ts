import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DEFAULT_LANG, I18n, LANGS, Lang } from '../i18n/i18n';
import { SITE_URL } from './business';

@Injectable({ providedIn: 'root' })
export class PageSeo {
  private title = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);
  private i18n = inject(I18n);

  apply(path: string, seo: { title: string; description: string }): void {
    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });

    this.doc.head.querySelectorAll('link[data-i18n]').forEach((el) => el.remove());
    const url = (lang: Lang) => `${SITE_URL}${this.i18n.url(path, lang)}`;
    this.addLink('canonical', url(this.i18n.lang()));
    for (const l of LANGS) this.addLink('alternate', url(l), l);
    this.addLink('alternate', url(DEFAULT_LANG), 'x-default');
  }

  private addLink(rel: string, href: string, hreflang?: string): void {
    const link = this.doc.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('href', href);
    link.setAttribute('data-i18n', '');
    if (hreflang) link.setAttribute('hreflang', hreflang);
    this.doc.head.appendChild(link);
  }

}
