import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Sell } from './pages/sell/sell';
import { langGuard } from './core/i18n/lang.guard';
import { Lang, SLUGS } from './core/i18n/i18n';

const pages = (lang: Lang): Routes => [
  { path: '', component: Home },
  { path: SLUGS['catalog'][lang], component: Sell },
];

export const routes: Routes = [
  { path: 'ru', canActivate: [langGuard], data: { lang: 'ru' }, children: pages('ru') },
  { path: '', canActivate: [langGuard], data: { lang: 'uk' }, children: pages('uk') },
];
