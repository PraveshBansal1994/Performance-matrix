import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HBarGraph } from './h-bar-graph';
import { PLATFORM_ID } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { NameValueData } from '@app/shared/models/name-value.model';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('HBarGraph Component', () => {
  let component: HBarGraph;
  let fixture: ComponentFixture<HBarGraph>;

  const mockData: NameValueData[] = [
    { name: 'HR', value: 10 },
    { name: 'Finance', value: 20 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HBarGraph],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }, provideAnimations()], // simulate browser platform
    }).compileComponents();

    fixture = TestBed.createComponent(HBarGraph);
    component = fixture.componentInstance;
    component.data$ = of(mockData);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should detect platform as browser', () => {
    expect(component.isBrowser).toBe(true);
  });

  it('should assign chartData$ on init when isBrowser is true', async () => {
    component.ngOnInit();
    const val = await firstValueFrom(component.chartData$);
    expect(val).toEqual(mockData);
  });

  it('should not assign chartData$ when not in browser', () => {
    // Recreate component with non-browser platform
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HBarGraph],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    }).compileComponents();

    const serverFixture = TestBed.createComponent(HBarGraph);
    const serverComponent = serverFixture.componentInstance;
    serverComponent.data$ = of(mockData);
    serverFixture.detectChanges();

    serverComponent.ngOnInit();
    expect(serverComponent.chartData$).toBeUndefined();
    expect(serverComponent.isBrowser).toBe(false);
  });

  it('should emit selectedData when onSelect is called', () => {
    const spy = vi.spyOn(component.selectedData, 'emit');
    const mockEvent = { name: 'HR', value: 10 } as unknown as Event;

    component.onSelect(mockEvent);

    // The component deep clones the event before emitting
    expect(spy).toHaveBeenCalledWith(JSON.parse(JSON.stringify(mockEvent)));
  });

  it('should have default chart options configured', () => {
    expect(component.showXAxis).toBe(false);
    expect(component.showYAxis).toBe(false);
    expect(component.gradient).toBe(false);
    expect(component.showLegend).toBe(false);
    expect(component.showXAxisLabel).toBe(true);
    expect(component.showYAxisLabel).toBe(true);
    expect(component.shoDataLabel).toBe(true);
    expect(component.yAxisWidth).toBe(5);
    expect(component.colorScheme.domain.length).toBeGreaterThan(0);
    expect(component.style).toContain('fill');
  });
});
