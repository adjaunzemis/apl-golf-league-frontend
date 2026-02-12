import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private storageKey = 'theme-preference';

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const saved = localStorage.getItem(this.storageKey);

    if (saved && (saved === 'light' || saved === 'dark')) {
      this.setTheme(saved);
    } else {
      // Optional: detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    this.setTheme(isDark ? 'light' : 'dark');
  }

  setTheme(theme: 'light' | 'dark') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem(this.storageKey, theme);
  }

  isDark(): boolean {
    return document.documentElement.classList.contains('dark');
  }
}
