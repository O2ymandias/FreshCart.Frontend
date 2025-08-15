import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

export function authInit() {
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  // Skip refresh on the server (SSR)
  if (!isPlatformBrowser(platformId)) return Promise.resolve();

  return new Promise<void>((resolve) => {
    authService.refreshToken().subscribe({
      next: () => resolve(),
      error: () => resolve(), // Always resolves so app can start.
    });
  });
}
