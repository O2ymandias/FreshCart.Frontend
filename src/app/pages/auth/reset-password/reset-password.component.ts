import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordPattern } from '../../../shared/models/auth-model';
import { equalValuesValidator } from '../auth.validator';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { RangePipe } from '../../../shared/pipes/range.pipe';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, tap, throwError } from 'rxjs';
import { AccountService } from '../../../core/services/account/account.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, RangePipe],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private readonly _accountService = inject(AccountService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _destroyRef = inject(DestroyRef);

  currLang = this._appTranslationService.currLang;
  email = input.required<string>();
  token = input.required<string>();
  formVisible = signal(true);
  successMsg = signal('');
  errorMsg = signal('');
  successMsgVisible = signal(false);
  errorMsgVisible = signal(false);
  resetPasswordForm = new FormGroup(
    {
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(passwordPattern),
      ]),

      confirmPassword: new FormControl('', Validators.required),
    },
    [equalValuesValidator('newPassword', 'confirmPassword')],
  );

  resetPassword() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const { newPassword } = this.resetPasswordForm.value;
    if (!newPassword || !this.email() || !this.token()) {
      this.successMsgVisible.set(false);
      this.errorMsgVisible.set(true);
      return;
    }

    this._accountService
      .resetPassword(this.email(), this.token(), newPassword)
      .pipe(
        tap((res) => {
          this.successMsgVisible.set(true);
          this.successMsg.set(res.message);
          this.errorMsgVisible.set(false);
          this.errorMsg.set('');
          this.formVisible.set(false);
          this.resetPasswordForm.reset();
        }),
        catchError((httpError: HttpErrorResponse) => {
          this.errorMsgVisible.set(true);
          this.errorMsg.set(httpError.error.message);
          this.successMsgVisible.set(false);
          this.successMsg.set('');
          this.formVisible.set(true);
          return throwError(() => httpError);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
