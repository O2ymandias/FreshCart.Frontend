import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { AccountService } from '../../../core/services/account/account.service';

@Component({
  selector: 'app-forget-password',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent {
  private readonly _accountService = inject(AccountService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _appTranslationService = inject(AppTranslationService);

  currLang = this._appTranslationService.currLang;
  message = signal('');
  formVisible = signal(true);
  forgetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  forgetPassword() {
    if (this.forgetPasswordForm.invalid) {
      this.forgetPasswordForm.markAllAsTouched();
      return;
    }
    const { email } = this.forgetPasswordForm.value;
    if (!email) return;

    this._accountService
      .forgetPassword(email)
      .pipe(
        tap((res) => {
          this.formVisible.set(false);
          this.message.set(res.message);
          this.forgetPasswordForm.reset();
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
