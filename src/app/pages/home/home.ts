import { Component, effect, inject } from '@angular/core';
import { Hero } from '../../sections/hero/hero';
import { Valuation } from '../../sections/valuation/valuation';
import { Steps } from '../../sections/steps/steps';
import { Faq } from '../../sections/faq/faq';
import { I18n } from '../../i18n/i18n';
import { PageSeo } from '../../seo/page-seo';
import { WhyUs } from '../../sections/why-us/why-us';
import { Cars } from '../../sections/cars/cars';
import { Details } from '../../sections/details/details';

@Component({
  selector: 'app-home',
  imports: [Hero, WhyUs, Cars, Steps, Details, Valuation, Faq],
  templateUrl: './home.html',
})
export class Home {
  constructor() {
    const seo = inject(PageSeo);
    const t = inject(I18n).t;
    effect(() => seo.apply('', t().seo.home));
  }
}
