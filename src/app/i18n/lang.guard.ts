import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { I18n, Lang } from './i18n';

export const langGuard: CanActivateFn = (route) => {
  inject(I18n).setLang(route.data['lang'] as Lang);
  return true;
};
