import { Injectable, Output, signal, EventEmitter } from '@angular/core';
import { ThemeEnum, ThemeType } from '@app/shared/models/theme-config.model';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  private themeSignal = signal<ThemeType>(ThemeEnum.Dark);

  readonly theme = this.themeSignal.asReadonly();

  public isRefreshData = new EventEmitter<boolean>();

  getTheme(): ThemeType {
    return this.themeSignal();
  }

  setTheme(theme: ThemeType): void {
    this.themeSignal.set(theme);
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }

  toggleTheme(): void {
    const newTheme: ThemeType = this.getTheme() === 'light' ? ThemeEnum.Dark : ThemeEnum.Light;
    this.setTheme(newTheme);
  }
}
