import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { UpdateUserProfileComponent } from './update-user-profile/update-user-profile.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AccountService } from '../../../core/services/account/account.service';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-account-info',
  imports: [UpdateUserProfileComponent, ModalComponent, TranslatePipe],
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.scss',
})
export class AccountInfoComponent implements OnInit {
  private readonly _accountService = inject(AccountService);
  private readonly _destroyRef = inject(DestroyRef);
  userInfo = this._accountService.userInfo;
  updateProfileModalVisible = signal(false);

  ngOnInit(): void {
    this._accountService
      .getUserInfo()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
  showUpdateProfileModal() {
    this.updateProfileModalVisible.set(true);
  }
  closeUpdateProfileModal() {
    this.updateProfileModalVisible.set(false);
  }
}
