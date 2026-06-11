import { Component, Input, OnInit } from '@angular/core';
import { Theme } from '@app/core/services/theme';
import { ThemeEnum, ThemeType } from '@app/shared/models/theme-config.model';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  @Input() title = '';
  @Input() subTitle = '';
  public refreshAt!: string;
  public isDarkTheme = true;

  constructor(private themeService: Theme) {}

  ngOnInit() {
    this.onRefresh();
  }

  public onRefresh(): void {
    this.refreshAt = this.getCurrentTime();
  }

  public getCurrentTheme(): string {
    return this.themeService.getTheme();
  }

  public toggleTheme(): void {
    const current: string = this.getCurrentTheme();
    let next: ThemeType;
    if (current === ThemeEnum.Dark) {
      next = ThemeEnum.Light;
      this.isDarkTheme = false;
    } else {
      next = ThemeEnum.Dark;
      this.isDarkTheme = true;
    }
    this.themeService.setTheme(next);
  }

  private getCurrentTime(): string {
    return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
}
