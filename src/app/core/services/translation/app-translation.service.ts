import {
  computed,
  inject,
  Injectable,
  PLATFORM_ID,
  RendererFactory2,
  signal,
} from '@angular/core';
import { InterpolationParameters, TranslateService } from '@ngx-translate/core';
import { SupportedLanguages } from './app-translation.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AppTranslationService {
  private _renderer = inject(RendererFactory2).createRenderer(null, null);
  private _translateService = inject(TranslateService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _defaultLang: SupportedLanguages = 'en';

  constructor() {
    this._translateService.addLangs(['en', 'ar']);
    if (isPlatformBrowser(this._platformId)) {
      const browserLang = this._translateService.getBrowserLang();
      const storedLang = localStorage.getItem('lang') as SupportedLanguages;
      const langToUse: SupportedLanguages =
        storedLang ?? (browserLang === 'ar' ? 'ar' : this._defaultLang);
      this.updateLanguage(langToUse);
    }
  }

  currLang = signal<SupportedLanguages>(this._defaultLang);
  locale = computed<'en-US' | 'ar-EG'>(() =>
    this.currLang() === 'ar' ? 'ar-EG' : 'en-US',
  );
  isReady = signal<boolean>(false);

  changePageDirection(lang: SupportedLanguages) {
    if (lang === 'ar') {
      this._renderer.setAttribute(document.documentElement, 'dir', 'rtl');
      this._renderer.setAttribute(document.documentElement, 'lang', 'ar');
    } else {
      this._renderer.setAttribute(document.documentElement, 'dir', 'ltr');
      this._renderer.setAttribute(document.documentElement, 'lang', 'en');
    }
  }

  changeFontFamily(lang: SupportedLanguages) {
    if (lang === 'ar') {
      this._renderer.addClass(document.body, 'font-cairo');
      this._renderer.removeClass(document.body, 'font-montserrat');
    } else {
      this._renderer.addClass(document.body, 'font-montserrat');
      this._renderer.removeClass(document.body, 'font-cairo');
    }
  }

  updateLanguage(lang: SupportedLanguages) {
    localStorage.setItem('lang', lang);
    this.currLang.set(lang);
    this._translateService.use(lang);
    this.changePageDirection(lang);
    this.changeFontFamily(lang);
    this.isReady.set(true);
  }

  getTranslation(key: string, interpolateParams?: InterpolationParameters) {
    return this._translateService.stream(key, interpolateParams);
  }
}
