import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IChangePasswordOptions,
  passwordPattern,
} from '../../../../../shared/models/auth-model';
import { equalValuesValidator } from '../../../../auth/auth.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, tap, throwError } from 'rxjs';
import { ToasterService } from '../../../../../core/services/toaster/toaster.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from '../../../../../core/services/account/account.service';
import { TranslatePipe } from '@ngx-translate/core';
import { RangePipe } from '../../../../../shared/pipes/range.pipe';
import { AppTranslationService } from '../../../../../core/services/translation/app-translation.service';

@Component({
  selector: 'app-update-password',
  imports: [ReactiveFormsModule, TranslatePipe, RangePipe],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss',
})
export class UpdatePasswordComponent implements OnInit {
  private readonly _accountService = inject(AccountService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _destroyRef = inject(DestroyRef);

  errorMsg = signal<string | null>(null);
  updated = output();
  isLoading = signal(false);
  toasterSuccessSummary = signal<string>('');
  updatePasswordForm = new FormGroup(
    {
      currentPassword: new FormControl<string>('', [Validators.required]),

      newPassword: new FormControl<string>('', [
        Validators.required,
        Validators.pattern(passwordPattern),
      ]),

      confirmNewPassword: new FormControl<string>('', Validators.required),
    },
    [equalValuesValidator('newPassword', 'confirmNewPassword')],
  );

  ngOnInit(): void {
    this._getTranslation$('toaster.accountUpdate.success.summary')
      .pipe(
        tap((res: string) => this.toasterSuccessSummary.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
  update() {
    if (this.updatePasswordForm.invalid) {
      this.updatePasswordForm.markAllAsTouched();
      return;
    }

    if (this.isLoading()) return;
    this.isLoading.set(true);

    const options: IChangePasswordOptions = {
      currentPassword: this.updatePasswordForm.value.currentPassword ?? '',
      newPassword: this.updatePasswordForm.value.newPassword ?? '',
    };

    this._accountService
      .changePassword(options)
      .pipe(
        tap((res) => {
          this.isLoading.set(false);
          this.errorMsg.set(null);
          this.updated.emit();
          this.updatePasswordForm.reset();
          this._toasterService.success({
            summary: this.toasterSuccessSummary(),
            detail: res.message,
          });
        }),
        catchError((httpError: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.errorMsg.set(httpError.error.message);
          return throwError(() => httpError);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getTranslation$(key: string) {
    return this._appTranslationService.getTranslation(key);
  }
}
