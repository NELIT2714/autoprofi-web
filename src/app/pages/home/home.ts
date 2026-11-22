import { Component, effect, inject } from '@angular/core';
import { Hero } from '../../sections/hero/hero';
import { Valuation } from '../../sections/valuation/valuation';
import { Steps } from '../../sections/steps/steps';
import { Faq } from '../../sections/faq/faq';
import { I18n } from '../../i18n/i18n';
import { PageSeo } from '../../seo/page-seo';

@Component({
  selector: 'app-home',
  imports: [Hero, Valuation, Steps, Faq],
  templateUrl: './home.html',
})
export class Home {
  constructor() {
    const seo = inject(PageSeo);
    const t = inject(I18n).t;
    effect(() => seo.apply('', t().seo.home));
  }
}
