/**
 * ThemeService
 * ------------
 * Application-wide dark / light mode state management.
 *
 * WHY A SERVICE: Dark mode is an application-level concern, not scoped to
 * any single component. Using an injectable service with a Signal means any
 * component (Navbar, Settings, future Admin panel) can read and toggle the
 * theme without prop-drilling or shared state overhead.
 *
 * WHY signal(): Angular's reactive primitive for lightweight state. Avoids
 * the overhead of a full BehaviorSubject/Observable for a simple boolean toggle.
 *
 * STRATEGY: The Stitch design uses darkMode: "class" — the .dark class on
 * <html> controls which theme variant renders. This service manages that class.
 *
 * INITIAL STATE: Reads the system color-scheme preference via
 * window.matchMedia on construction. The html element in index.html starts
 * with class="dark" so there is no flash of unstyled content (FOUC) on first
 * load before Angular initialises.
 */

import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  /** Current theme signal — reactive source of truth */
  readonly theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Whenever theme signal changes, sync the .dark class on <html> and persist
    effect(() => {
      const currentTheme = this.theme();
      if (typeof window !== 'undefined') {
        localStorage.setItem('fixo-theme', currentTheme);
      }
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  /** Toggle between dark and light */
  toggle(): void {
    this.theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  /** Set theme explicitly */
  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  /** Read system preference or saved preference on first load */
  private getInitialTheme(): Theme {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fixo-theme') as Theme | null;
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    }
    return 'dark';
  }
}
