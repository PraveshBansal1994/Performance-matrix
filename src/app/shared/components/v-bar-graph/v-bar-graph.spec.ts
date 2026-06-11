// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { VBarGraph } from './v-bar-graph';

// describe('VBarGraph', () => {
//   let component: VBarGraph;
//   let fixture: ComponentFixture<VBarGraph>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [VBarGraph],
//     }).compileComponents();

//     fixture = TestBed.createComponent(VBarGraph);
//     component = fixture.componentInstance;
//     await fixture.whenStable();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { VBarGraph } from './v-bar-graph';
// import { Theme } from '@app/core/services/theme';
// import { ThemeEnum } from '@app/shared/models/theme-config.model';
// import { NameValueData } from '@app/shared/models/name-value.model';
// import { provideAnimations } from '@angular/platform-browser/animations';

// describe('VBarGraph', () => {
//   let fixture: ComponentFixture<VBarGraph>;
//   let component: VBarGraph;
//   let mockThemeService: { theme: ReturnType<typeof vi.fn> };

//   beforeEach(async () => {
//     mockThemeService = {
//       theme: vi.fn().mockReturnValue(ThemeEnum.Dark),
//     };

//     await TestBed.configureTestingModule({
//       imports: [VBarGraph],
//       providers: [{ provide: Theme, useValue: mockThemeService }, provideAnimations()],
//     }).compileComponents();

//     fixture = TestBed.createComponent(VBarGraph);
//     component = fixture.componentInstance;
//   });

//   it('should create', () => {
//     fixture.detectChanges();
//     expect(component).toBeTruthy();
//   });

//   it('should initialize single with input data on ngOnInit', () => {
//     const testData: NameValueData[] = [
//       { name: 'A', value: 10 },
//       { name: 'B', value: 20 },
//     ];
//     component.data = testData;

//     fixture.detectChanges(); // triggers ngOnInit

//     expect(component.single).toEqual(testData);
//   });

//   it('should set style to red when theme is Light', () => {
//     mockThemeService.theme.mockReturnValue(ThemeEnum.Dark);

//     fixture.detectChanges();

//     expect(component.style).toBe('fill: #FF0000');
//   });

//   it('should set style to dark red when theme is Dark', () => {
//     mockThemeService.theme.mockReturnValue(ThemeEnum.Dark);

//     fixture.detectChanges();

//     expect(component.style).toBe('fill: #e74c3c');
//   });

//   it('should keep colorScheme domain intact', () => {
//     fixture.detectChanges();

//     expect(component.colorScheme.domain).toEqual([
//       '#006BE6',
//       '#00ce90',
//       '#fc9b01',
//       '#875fff',
//       '#FF286D',
//     ]);
//   });

//   it('should log event on select', () => {
//     const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
//     const fakeEvent = new Event('click');

//     component.onSelect(fakeEvent);

//     expect(logSpy).toHaveBeenCalledWith(fakeEvent);

//     logSpy.mockRestore();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VBarGraph } from './v-bar-graph';
import { Theme } from '@app/core/services/theme';
import { ThemeEnum } from '@app/shared/models/theme-config.model';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('VBarGraph', () => {
  let fixture: ComponentFixture<VBarGraph>;
  let component: VBarGraph;
  let mockThemeService: { theme: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockThemeService = {
      theme: vi.fn(), // we’ll set return values per test
    };

    await TestBed.configureTestingModule({
      imports: [VBarGraph],
      providers: [{ provide: Theme, useValue: mockThemeService }, provideAnimations()],
    }).compileComponents();
  });

  it('should set style to red when theme is Light', () => {
    mockThemeService.theme.mockReturnValue(ThemeEnum.Light);

    fixture = TestBed.createComponent(VBarGraph);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.style).toBe('fill: #FF0000');
  });

  it('should set style to dark red when theme is Dark', () => {
    mockThemeService.theme.mockReturnValue(ThemeEnum.Dark);

    fixture = TestBed.createComponent(VBarGraph);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.style).toBe('fill: #e74c3c');
  });

  it('should initialize single with input data on ngOnInit', () => {
    mockThemeService.theme.mockReturnValue(ThemeEnum.Dark);

    fixture = TestBed.createComponent(VBarGraph);
    component = fixture.componentInstance;
    component.data = [
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
    ];
    fixture.detectChanges();

    expect(component.single).toEqual(component.data);
  });
});
