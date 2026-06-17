import { TestBed } from '@angular/core/testing';
import { Theme } from './theme';
import { ThemeEnum } from '@app/shared/models/theme-config.model';

describe('Theme Service', () => {
  let service: Theme;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Theme);

    document.body.className = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with Dark theme by default', () => {
    expect(service.getTheme()).toBe(ThemeEnum.Dark);
    expect(service.theme()).toBe(ThemeEnum.Dark);
  });

  it('should set theme to Light and update body class', () => {
    service.setTheme(ThemeEnum.Light);

    expect(service.getTheme()).toBe(ThemeEnum.Light);
    expect(document.body.classList.contains('light-theme')).to.equal(true);
    expect(document.body.classList.contains('dark-theme')).to.equal(false);
  });

  it('should set theme to Dark and update body class', () => {
    service.setTheme(ThemeEnum.Dark);

    expect(service.getTheme()).toBe(ThemeEnum.Dark);
    expect(document.body.classList.contains('dark-theme')).to.equal(true);
    expect(document.body.classList.contains('light-theme')).to.equal(false);
  });

  it('should toggle from Dark to Light', () => {
    service.toggleTheme();

    expect(service.getTheme()).toBe(ThemeEnum.Light);
    expect(document.body.classList.contains('light-theme')).to.equal(true);
  });

  it('should toggle from Light to Dark', () => {
    service.setTheme(ThemeEnum.Light);
    service.toggleTheme();

    expect(service.getTheme()).toBe(ThemeEnum.Dark);
    expect(document.body.classList.contains('dark-theme')).to.equal(true);
  });

  it('should remove old theme classes when setting a new theme', () => {
    service.setTheme(ThemeEnum.Light);
    expect(document.body.classList.contains('light-theme')).to.equal(true);

    service.setTheme(ThemeEnum.Dark);
    expect(document.body.classList.contains('light-theme')).to.equal(false);
    expect(document.body.classList.contains('dark-theme')).to.equal(true);
  });
});
