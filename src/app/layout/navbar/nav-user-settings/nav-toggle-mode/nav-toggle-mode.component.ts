import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  effect,
  inject,
  PLATFORM_ID,
  Renderer2,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

type Theme = 'light' | 'dark';
@Component({
  selector: 'app-nav-toggle-mode',
  imports: [FormsModule],
  templateUrl: './nav-toggle-mode.component.html',
  styleUrl: './nav-toggle-mode.component.scss',
})
export class NavToggleModeComponent {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _renderer = inject(Renderer2);
  private readonly THEME_KEY = 'user-theme';

  constructor() {
    if (isPlatformBrowser(this._platformId)) this.init();
  }

  theme = signal<Theme>('dark');
  initialized = signal(false);

  toggleTheme() {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(newTheme);
    localStorage.setItem(this.THEME_KEY, newTheme);
  }

  init() {
    let storedTheme: Theme | null = null;

    switch (localStorage.getItem(this.THEME_KEY)) {
      case 'light':
        storedTheme = 'light';
        break;
      case 'dark':
        storedTheme = 'dark';
        break;
    }

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    this.theme.set(storedTheme ?? (prefersDark ? 'dark' : 'light'));

    effect(() => {
      const currentTheme = this.theme();
      this._renderer.setAttribute(
        document.documentElement,
        'data-theme',
        currentTheme,
      );
    });

    this.initialized.set(true);
  }
}
