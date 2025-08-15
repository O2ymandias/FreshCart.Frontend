import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ILoginUser } from '../../../shared/models/auth-model';
import { catchError, tap, throwError } from 'rxjs';
import { ToasterService } from '../../../core/services/toaster/toaster.service';
import { InterpolationParameters, TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../../core/services/translation/app-translation.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _toasterService = inject(ToasterService);
  private readonly _router = inject(Router);
  private readonly _appTranslationService = inject(AppTranslationService);

  currLang = this._appTranslationService.currLang;
  returnUrl = input<string>('/');
  toasterSuccessSummary = signal<string>('');
  errorMsg = signal<string | null>(null);
  loginForm = new FormGroup({
    userNameOrEmail: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });

  ngOnInit(): void {
    this._getToasterSuccessSummary();
  }
  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { userNameOrEmail, password } = this.loginForm.value;

    const login: ILoginUser = {
      userNameOrEmail: userNameOrEmail!,
      password: password!,
    };

    this._authService
      .login(login)
      .pipe(
        tap((res) => {
          this._router.navigateByUrl(this.returnUrl());
          this._toasterService.success({
            summary: this.toasterSuccessSummary(),
            detail: res.message,
          });
        }),
        catchError((err: HttpErrorResponse) => {
          this.errorMsg.set(err.error.message);
          return throwError(() => err);
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
    this._getTranslation$('toaster.login.success.summary')
      .pipe(
        tap((res: string) => this.toasterSuccessSummary.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((res) => this.toasterSuccessSummary.set(res));
  }
}
