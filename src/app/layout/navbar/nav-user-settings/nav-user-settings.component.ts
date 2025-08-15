import { AppTranslationService } from './../../../core/services/translation/app-translation.service';
import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { NavToggleModeComponent } from './nav-toggle-mode/nav-toggle-mode.component';
import { NavToggleLangComponent } from './nav-toggle-lang/nav-toggle-lang.component';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountService } from '../../../core/services/account/account.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-nav-user-settings',
  imports: [NavToggleModeComponent, NavToggleLangComponent, TranslatePipe],
  templateUrl: './nav-user-settings.component.html',
  styleUrl: './nav-user-settings.component.scss',
})
export class NavUserSettingsComponent {
  private readonly _wishlistService = inject(WishlistService);
  private readonly _accountService = inject(AccountService);
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _router = inject(Router);
  private readonly _appTranslationService = inject(AppTranslationService);

  isAuthenticated = this._authService.isAuthenticated;
  displayName = computed(() => this._authService.jwtPayload()?.name);
  dropdown = viewChild.required<ElementRef<HTMLDivElement>>('dropdown');
  currLang = this._appTranslationService.currLang;

  blur(event: MouseEvent) {
    const btn = event.target as HTMLButtonElement;
    btn.blur();
  }
  navigateTo(event: MouseEvent, routes: string[]) {
    this._router.navigate(routes);
    this.blur(event);
  }
  logout(event: MouseEvent) {
    this._authService
      .logout()
      .pipe(
        tap(() => {
          this.blur(event);
          this._wishlistService.reset();
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
