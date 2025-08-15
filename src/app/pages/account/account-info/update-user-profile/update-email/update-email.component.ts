import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IRequestEmailChangeOptions } from '../../../../../shared/models/auth-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from '../../../../../core/services/toaster/toaster.service';
import { AccountService } from '../../../../../core/services/account/account.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../../../../core/services/translation/app-translation.service';

@Component({
  selector: 'app-update-email',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './update-email.component.html',
  styleUrl: './update-email.component.scss',
})
export class UpdateEmailComponent implements OnInit {
  private readonly _accountService = inject(AccountService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _destroyRef = inject(DestroyRef);

  step = signal<1 | 2>(1);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  updated = output();
  isLoading = signal(false);
  requestEmailChangeForm = new FormGroup({
    newEmail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  confirmChangeEmailForm = new FormGroup({
    verificationCode: new FormControl('', [Validators.required]),
  });
  toasterSuccessSummary = signal<string>('');

  ngOnInit(): void {
    this._initToasterSuccessSummary();
  }
  requestEmailChange() {
    if (this.requestEmailChangeForm.invalid) {
      this.requestEmailChangeForm.markAllAsTouched();
      return;
    }

    if (this.isLoading()) return;
    this.isLoading.set(true);

    const { password, newEmail } = this.requestEmailChangeForm.value;
    const options: IRequestEmailChangeOptions = {
      newEmail: newEmail ?? '',
      password: password ?? '',
    };

    this._accountService
      .requestEmailChange(options)
      .pipe(
        tap((res) => {
          this.isLoading.set(false);
          this.errorMessage.set(null);
          this.successMessage.set(res.message);
          this.requestEmailChangeForm.reset();
          this.step.set(2);
        }),
        catchError((err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.successMessage.set(null);
          this.errorMessage.set(err.error.message);
          return throwError(() => err);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
  confirmEmailChange() {
    if (this.confirmChangeEmailForm.invalid) {
      this.confirmChangeEmailForm.markAllAsTouched();
      return;
    }

    if (this.isLoading()) return;
    this.isLoading.set(true);

    const verificationCode =
      this.confirmChangeEmailForm.value.verificationCode ?? '';

    this._accountService
      .confirmEmailChange(verificationCode)
      .pipe(
        tap((res) => {
          this.isLoading.set(false);
          this.errorMessage.set(null);
          this.successMessage.set(null);
          this.step.set(1);
          this.confirmChangeEmailForm.reset();
          this.updated.emit();
          this._toasterService.success({
            summary: this.toasterSuccessSummary(),
            detail: res.message,
          });
        }),
        catchError((err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.successMessage.set(null);
          this.errorMessage.set(err.error.message);
          return throwError(() => err);
        }),
        switchMap(() => this._accountService.getUserInfo()),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _initToasterSuccessSummary() {
    this._getTranslation$('toaster.accountUpdate.success.summary')
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((res) => {
        this.toasterSuccessSummary.set(res);
      });
  }
  private _getTranslation$(key: string) {
    return this._appTranslationService.getTranslation(key);
  }
}
