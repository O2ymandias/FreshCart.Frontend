import {
  ApplicationConfig,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { authInit } from './core/services/auth/auth-initializer';
import { withInterceptorsFromDi } from '@angular/common/http';
import { provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';
import { provideLoadingBarRouter } from '@ngx-loading-bar/router';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { httpLoaderFactory } from './core/services/translation/app-translation.model';
import { cultureRequestQueryInterceptor } from './core/interceptors/culture-request-query.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ),
    provideClientHydration(withEventReplay()),

    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, cultureRequestQueryInterceptor]),
    ),

    // for HttpClient use:
    provideHttpClient(withInterceptorsFromDi()),
    provideLoadingBarInterceptor(),

    // for Router use:
    provideLoadingBarRouter(),

    // PrimeNG
    provideAnimationsAsync(),

    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'html[data-theme="dark"]',
        },
      },
    }),
    MessageService,
    ConfirmationService,

    // AuthInitializer
    provideAppInitializer(authInit),

    // TranslateService
    provideTranslateService({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
};
