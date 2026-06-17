import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Theme } from '@app/core/services/theme';
import { MonthlyTrendProcessed } from '@app/shared/models/monthly-trend-processed.model';
import { ThemeEnum } from '@app/shared/models/theme-config.model';
import { LineChart } from './line-chart';

// Mock Theme service
class MockThemeService {
  private themeSignal = signal(ThemeEnum.Dark);
  theme() {
    return this.themeSignal();
  }
  setTheme(val: ThemeEnum) {
    this.themeSignal.set(val);
  }
}

describe('LineChart Component', () => {
  let component: LineChart;
  let fixture: ComponentFixture<LineChart>;
  let themeService: MockThemeService;

  const mockData: MonthlyTrendProcessed[] = [
    { name: 'Jan', series: [{ name: '2026', value: 100 }] },
    { name: 'Feb', series: [{ name: '2026', value: 200 }] },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChart],
      providers: [{ provide: Theme, useClass: MockThemeService }, provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChart);
    component = fixture.componentInstance;
    themeService = TestBed.inject(Theme) as unknown as MockThemeService;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default inputs', () => {
    expect(component.data).toEqual([]);
    expect(component.multi).toEqual([]);
    expect(component.legend).toBe(false);
    expect(component.showLabels).toBe(true);
    expect(component.xAxis).toBe(true);
    expect(component.yAxis).toBe(true);
    expect(component.showXAxisLabel).toBe(true);
    expect(component.showYAxisLabel).toBe(true);
    expect(component.colorScheme.domain).toEqual(['#00e5a0', '#60a5fa']);
    expect(component.style).toBe('fill: #e74c3c');
  });

  it('should set multi to input data on init', () => {
    component.data = mockData;
    component.ngOnInit();
    expect(component.multi).toEqual(mockData);
  });

  it('should update colorScheme and style when theme is Dark', () => {
    themeService.setTheme(ThemeEnum.Dark);
    fixture.detectChanges();
    expect(component.colorScheme.domain).toEqual(['#00e5a0', '#60a5fa']);
    expect(component.style).toBe('fill: #e74c3c');
  });
});
