import { Component, DestroyRef, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { AuthService } from './core/services/auth/auth.service';
import { ToasterService } from './core/services/toaster/toaster.service';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastModule,
    ConfirmDialog,
    LoadingBarModule,
    ScrollTopModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _toasterService = inject(ToasterService);

  title = 'ECommerce';
}
