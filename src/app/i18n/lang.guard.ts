import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { I18n, Lang } from './i18n';

let firstVisit = true;

export const langGuard: CanActivateFn = (route, state) => {
  const i18n = inject(I18n);
  const router = inject(Router);
  const lang = route.data['lang'] as Lang;

  const isFirst = firstVisit;
  firstVisit = false;

  if (isFirst) {
    const saved = i18n.saved();
    const isHome = state.url.split(/[?#]/)[0] === i18n.url('', lang);
    if (saved && saved !== lang && isHome) {
      return router.parseUrl(i18n.url('', saved));
    }
  }

  i18n.setLang(lang);
  return true;
};
