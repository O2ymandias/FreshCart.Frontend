import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IRegisterUser,
  passwordPattern,
} from '../../../shared/models/auth-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToasterService } from '../../../core/services/toaster/toaster.service';
import { catchError, tap, throwError } from 'rxjs';
import { equalValuesValidator } from '../auth.validator';
import { InterpolationParameters, TranslatePipe } from '@ngx-translate/core';
import { RangePipe } from '../../../shared/pipes/range.pipe';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe, RangePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  currLang = this._appTranslationService.currLang;
  errorMsg = signal<string | null>(null);
  toasterSuccessSummary = signal<string>('');
  registerForm = new FormGroup(
    {
      displayName: new FormControl<string>('', [
        Validators.required,
        Validators.maxLength(50),
      ]),

      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),

      userName: new FormControl<string>('', [
        Validators.required,
        Validators.maxLength(50),
      ]),

      password: new FormControl<string>('', [
        Validators.required,
        Validators.pattern(passwordPattern),
      ]),

      confirmPassword: new FormControl<string>('', Validators.required),

      phoneNumber: new FormControl<string>('', [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/),
      ]),

      address: new FormGroup({
        street: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),
        country: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),
      }),
    },
    [equalValuesValidator('password', 'confirmPassword')],
  );

  ngOnInit(): void {
    this._getToasterSuccessSummary();
  }
  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { displayName, email, userName, password, phoneNumber, address } =
      this.registerForm.value;

    const registerUser: IRegisterUser = {
      displayName: displayName ?? '',
      email: email ?? '',
      userName: userName ?? '',
      password: password ?? '',
      phoneNumber: phoneNumber ?? '',
      address: {
        street: address?.street ?? '',
        city: address?.city ?? '',
        country: address?.country ?? '',
      },
    };

    this._authService
      .register(registerUser)
      .pipe(
        tap((res) => {
          this._toasterService.success({
            summary: this.toasterSuccessSummary(),
            detail: res.message,
          });

          this._router.navigate(['/']);
        }),

        catchError((httpError: HttpErrorResponse) => {
          this.errorMsg.set(httpError.error.message);
          return throwError(() => httpError);
        }),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getTranslation$(
    key: string,
    interpolateParams?: InterpolationParameters,
  ) {
    return this._appTranslationService.getTranslation(key, interpolateParams);
  }
  private _getToasterSuccessSummary() {
    this._getTranslation$('toaster.register.success.summary')
      .pipe(
        tap((res: string) => this.toasterSuccessSummary.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((res) => this.toasterSuccessSummary.set(res));
  }
}
