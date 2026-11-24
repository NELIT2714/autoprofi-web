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
    const preferred = i18n.saved() ?? i18n.browserLang();
    const isHome = state.url.split(/[?#]/)[0] === i18n.url('', lang);
    if (preferred && preferred !== lang && isHome) {
      return router.parseUrl(i18n.url('', preferred));
    }
  }

  i18n.setLang(lang);
  return true;
};
