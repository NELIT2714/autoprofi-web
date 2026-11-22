import { Routes } from '@angular/router';
import { langGuard } from './i18n/lang.guard';
import { Home } from './pages/home/home';

const pages = (): Routes => [
  { path: '', component: Home },
];

export const routes: Routes = [
  { path: 'ru', canActivate: [langGuard], data: { lang: 'ru' }, children: pages() },
  { path: '', canActivate: [langGuard], data: { lang: 'uk' }, children: pages() },
  // { path: '**', component: NotFound },
];
