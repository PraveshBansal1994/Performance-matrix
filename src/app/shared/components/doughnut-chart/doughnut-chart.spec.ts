import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoughnutChart } from './doughnut-chart';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NameValueData } from '@app/shared/models/name-value.model';

describe('DoughnutChart Component', () => {
  let component: DoughnutChart;
  let fixture: ComponentFixture<DoughnutChart>;

  const mockData: NameValueData[] = [
    { name: 'Sales', value: 100 },
    { name: 'Marketing', value: 50 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoughnutChart, NgxChartsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DoughnutChart);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty data by default', () => {
    expect(component.data).toEqual([]);
    expect(component.single).toEqual([]);
  });

  it('should set single to input data on init', () => {
    component.data = mockData;
    component.ngOnInit();
    expect(component.single).toEqual(mockData);
  });

  it('should have default chart options configured', () => {
    expect(component.gradient).toBe(false);
    expect(component.showLegend).toBe(false);
    expect(component.showLabels).toBe(false);
    expect(component.isDoughnut).toBe(true);
    expect(component.legendPosition).toBe('below');
  });

  it('should have a valid color scheme', () => {
    expect(component.colorScheme.name).toBe('customScheme');
    expect(component.colorScheme.selectable).toBe(true);
    expect(component.colorScheme.group).toBeDefined();
    expect(component.colorScheme.domain.length).toBeGreaterThan(0);
  });
});
