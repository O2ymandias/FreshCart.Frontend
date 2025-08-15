import { Component, inject, signal } from '@angular/core';
import { AppTranslationService } from '../../../../core/services/translation/app-translation.service';
import { SupportedLanguages } from '../../../../core/services/translation/app-translation.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-toggle-lang',
  imports: [TranslatePipe],
  templateUrl: './nav-toggle-lang.component.html',
  styleUrl: './nav-toggle-lang.component.scss',
})
export class NavToggleLangComponent {
  private readonly _appTranslationService = inject(AppTranslationService);

  lang = signal<SupportedLanguages>(this._appTranslationService.currLang());

  toggleLanguage() {
    this.lang.set(this.lang() === 'en' ? 'ar' : 'en');
    this._appTranslationService.updateLanguage(this.lang());
  }
}
