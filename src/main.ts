import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import localeAr from '@angular/common/locales/ar';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeAr);
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
