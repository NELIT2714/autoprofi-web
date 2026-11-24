import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DEFAULT_LANG, I18n, LANGS, Lang } from '../i18n/i18n';
import { SITE_URL } from './business';

const OG_LOCALE: Record<Lang, string> = {
  uk: 'uk_UA',
  ru: 'ru_UA',
};

const SITE_NAME = 'AutoProfi';

@Injectable({ providedIn: 'root' })
export class PageSeo {
  private title = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);
  private i18n = inject(I18n);

  apply(
    path: string,
    seo: { title: string; description: string },
    options: { noindex?: boolean } = {},
  ): void {
    const lang = this.i18n.lang();
    const url = (l: Lang) => `${SITE_URL}${this.i18n.url(path, l)}`;
    const canonical = url(lang);

    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });

    this.applyOpenGraph(seo, canonical, lang);

    this.doc.head.querySelectorAll('link[data-i18n]').forEach((el) => el.remove());
    this.addLink('canonical', canonical);
    for (const l of LANGS) this.addLink('alternate', url(l), l);
    this.addLink('alternate', url(DEFAULT_LANG), 'x-default');
  }

  private applyOpenGraph(
    seo: { title: string; description: string },
    canonical: string,
    lang: Lang,
  ): void {
    const image = `${SITE_URL}/og/og-image-${lang}.jpg`;

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:locale', content: OG_LOCALE[lang] });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:image:alt', content: seo.title });

    this.doc.head
      .querySelectorAll('meta[property="og:locale:alternate"]')
      .forEach((el) => el.remove());
    for (const l of LANGS) {
      if (l === lang) continue;
      const alt = this.doc.createElement('meta');
      alt.setAttribute('property', 'og:locale:alternate');
      alt.setAttribute('content', OG_LOCALE[l]);
      this.doc.head.appendChild(alt);
    }

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
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
