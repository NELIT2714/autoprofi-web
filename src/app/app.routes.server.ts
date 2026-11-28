import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'ru', renderMode: RenderMode.Prerender },
  { path: 'kupyty-avto-kharkiv', renderMode: RenderMode.Prerender },
  { path: 'ru/kupit-avto-harkov', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Server },
];
