import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { SupportedLanguages } from '../services/translation/app-translation.model';

export const cultureRequestQueryInterceptor: HttpInterceptorFn = (
  req,
  next,
) => {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    const storedLang = localStorage.getItem('lang') as SupportedLanguages;
    req = req.clone({ params: req.params.set('culture', storedLang) });
  }
  return next(req);
};
