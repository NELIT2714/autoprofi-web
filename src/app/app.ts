import { Component, signal } from '@angular/core';

import { Header } from './layout/header/header';
import { Hero } from './sections/hero/hero';
import { Valuation } from './sections/valuation/valuation';
import { Steps } from './sections/steps/steps';
import { Faq } from './sections/faq/faq';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, Hero, Valuation, Steps, Faq, Footer],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('web');
}
