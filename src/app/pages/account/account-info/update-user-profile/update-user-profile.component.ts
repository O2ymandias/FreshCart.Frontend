import { Component, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateBasicInfoComponent } from './update-basic-info/update-basic-info.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { UpdateEmailComponent } from './update-email/update-email.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-update-user-profile',
  imports: [
    ReactiveFormsModule,
    UpdateBasicInfoComponent,
    UpdatePasswordComponent,
    UpdateEmailComponent,
    TranslatePipe,
  ],
  templateUrl: './update-user-profile.component.html',
  styleUrl: './update-user-profile.component.scss',
})
export class UpdateUserProfileComponent {
  updated = output();
  onUpdate() {
    this.updated.emit();
  }
}
