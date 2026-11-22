import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { I18n } from './i18n/i18n';
import { JsonLd } from './seo/json-ld';
import { buildBusinessSchema } from './seo/business';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
})
export class App {
  constructor() {
    const jsonLd = inject(JsonLd);
    const lang = inject(I18n).lang;
    effect(() => jsonLd.set('ld-business', buildBusinessSchema(lang())));
  }
}
