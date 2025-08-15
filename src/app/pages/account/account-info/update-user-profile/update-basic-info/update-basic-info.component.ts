import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from '../../../../../core/services/toaster/toaster.service';
import { AccountService } from '../../../../../core/services/account/account.service';
import { TranslatePipe } from '@ngx-translate/core';
import { RangePipe } from '../../../../../shared/pipes/range.pipe';
import { AppTranslationService } from '../../../../../core/services/translation/app-translation.service';

@Component({
  selector: 'app-update-basic-info',
  imports: [ReactiveFormsModule, FormsModule, TranslatePipe, RangePipe],
  templateUrl: './update-basic-info.component.html',
  styleUrl: './update-basic-info.component.scss',
})
export class UpdateBasicInfoComponent implements OnInit {
  private readonly _accountService = inject(AccountService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _appTranslationService = inject(AppTranslationService);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const basicInfo = this.basicInfo();
      this.updateBasicInfoForm.patchValue(basicInfo);
    });
  }

  basicInfo = computed(() => {
    const userInfo = this._accountService.userInfo();
    return {
      displayName: userInfo?.displayName,
      phoneNumber: userInfo?.phoneNumber,
      address: {
        street: userInfo?.address?.street,
        city: userInfo?.address?.city,
        country: userInfo?.address?.country,
      },
    };
  });
  toasterSuccessSummary = signal('');
  avatarFile = signal<File | null>(null);
  updateAvatarUrl = computed(() => {
    const file = this.avatarFile();
    const profile = this._accountService.userInfo();
    return file
      ? URL.createObjectURL(file)
      : (profile?.pictureUrl ?? '/anonymous.png');
  });
  updated = output();
  errorMsg = signal<string | null>(null);
  isLoading = signal(false);
  updateBasicInfoForm = new FormGroup({
    displayName: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(50),
    ]),

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
  });

  ngOnInit(): void {
    this._initToasterSuccessSummary();
  }
  onAvatarUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (file) this.avatarFile.set(file);
  }
  update() {
    if (this.updateBasicInfoForm.invalid) {
      this.updateBasicInfoForm.markAllAsTouched();
      return;
    }

    if (this.isLoading()) return;

    this.isLoading.set(true);

    const data: FormData = new FormData();

    const { displayName, phoneNumber, address } =
      this.updateBasicInfoForm.value;

    data.append('address.street', address?.street ?? '');
    data.append('address.city', address?.city ?? '');
    data.append('address.country', address?.country ?? '');

    data.append('displayName', displayName ?? '');
    data.append('phoneNumber', phoneNumber ?? '');

    const avatarFile = this.avatarFile();
    if (avatarFile) data.append('avatar', avatarFile);

    this._accountService
      .updateBasicInfo(data)
      .pipe(
        tap((res) => {
          this.isLoading.set(false);
          this.updateBasicInfoForm.reset();
          this.avatarFile.set(null);
          this.errorMsg.set(null);
          this.updated.emit();
          this._toasterService.success({
            summary: this.toasterSuccessSummary(),
            detail: res.message,
          });
        }),
        catchError((httpError: HttpErrorResponse) => {
          this.errorMsg.set(httpError.error.message);
          this.isLoading.set(false);
          return throwError(() => httpError);
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
