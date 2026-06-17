import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { Theme } from '@app/core/services/theme';
import { ThemeEnum } from '@app/shared/models/theme-config.model';
import { vi } from 'vitest';

class MockThemeService {
  private theme = ThemeEnum.Dark;

  isRefreshData!: {
    emit: ReturnType<typeof vi.fn>;
  };

  getTheme() {
    return this.theme;
  }
  setTheme(next: ThemeEnum) {
    this.theme = next;
  }

  constructor() {
    this.isRefreshData = {
      emit: vi.fn(),
    };
  }
}

describe('Header Component', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let themeService: MockThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [{ provide: Theme, useClass: MockThemeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    themeService = TestBed.inject(Theme) as unknown as MockThemeService;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default inputs', () => {
    expect(component.title).toBe('');
    expect(component.subTitle).toBe('');
  });

  it('should call onRefresh on init', () => {
    expect(component.refreshAt).toBeDefined();
    expect(component.refreshAt).not.toBe('');
  });

  it('onRefresh should update refreshAt with current time', () => {
    const expected = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    component.onRefresh();
    expect(component.refreshAt).toBe(expected);
  });

  it('getCurrentTheme should return theme from service', () => {
    expect(component.getCurrentTheme()).toBe(ThemeEnum.Dark);
  });

  it('toggleTheme should switch from Dark to Light', () => {
    component.toggleTheme();
    expect(component.isDarkTheme).toBe(false);
    expect(themeService.getTheme()).toBe(ThemeEnum.Light);
  });

  it('toggleTheme should switch back from Light to Dark', () => {
    // First toggle to Light
    component.toggleTheme();
    // Then toggle again
    component.toggleTheme();
    expect(component.isDarkTheme).toBe(true);
    expect(themeService.getTheme()).toBe(ThemeEnum.Dark);
  });
});
