import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, Subject, firstValueFrom } from 'rxjs';
import { Dashboard } from './dashboard';
import { DashboardService } from './services/dashboard';
import { Kpi } from '@app/shared/models/kpi.model';
import { MonthlyTrendProcessed } from '@app/shared/models/monthly-trend-processed.model';
import { NameValueData } from '@app/shared/models/name-value.model';
import { IEmployees } from '@app/shared/models/employees.model';
import { provideAnimations } from '@angular/platform-browser/animations';
import { GridFeatures } from '@app/shared/models/grid-features.model';
import { SortInformation } from '@app/shared/models/sort-information.model';
import { PaginationInfo } from '@app/shared/models/pagination.model';

describe('Dashboard Component (Vitest)', () => {
  let fixture: ComponentFixture<Dashboard>;
  let component: Dashboard;
  let serviceMock: any;
  let mockData: IEmployees = {
    data: [
      {
        id: 1,
        firstname: 'Test firstname',
        lastname: 'Test lastname',
        age: 24,
        gender: 'male',
        email: 'firstname.lastname@test.com',
        phone: '+1 99 999 9999',
        department: 'HR',
        role: 'Admin',
        status: 'Active',
        joiningDate: '2026-01-13',
      },
    ],
    first: 1,
    items: 1,
    last: 1,
    next: 2,
    pages: 1,
    prev: null,
  };

  beforeEach(async () => {
    serviceMock = {
      getKpis: vi.fn(),
      getMonthlyTrend: vi.fn(),
      getDepartmentDetails: vi.fn(),
      getGoalProgress: vi.fn(),
      getEmpDetails: vi.fn(),
      getTopEmployeesScoreCompForEachDept: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideAnimations()],
    })
      .overrideComponent(Dashboard, {
        set: {
          providers: [{ provide: DashboardService, useValue: serviceMock }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load KPI and other data on init', async () => {
    serviceMock.getKpis.mockReturnValue(of({} as Kpi));
    serviceMock.getMonthlyTrend.mockReturnValue(of([{ name: 'avg', series: [] }]));
    serviceMock.getDepartmentDetails.mockReturnValue(of([{ name: 'HR', value: 50 }]));
    serviceMock.getGoalProgress.mockReturnValue(of([{ name: 'Sales', value: '50.00' }]));
    serviceMock.getEmpDetails.mockReturnValue(of(mockData));
    serviceMock.getTopEmployeesScoreCompForEachDept.mockReturnValue(
      of([{ name: 'John', value: 90 }])
    );

    fixture.detectChanges(); // triggers ngOnInit

    // wait for microtasks to flush
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(component.monthlyTrendData).toEqual([{ name: 'avg', series: [] }]);
    expect(component.deptDetailsData).toEqual([{ name: 'HR', value: 50 }]);
    expect(component.goalProgressData).toEqual([{ name: 'Sales', value: '50.00' }]);
    expect(component.kpisData$).toBeDefined();
    expect(component.employeesDetails$).toBeDefined();
    expect(component.topEmployeeComp$).toBeDefined();
  });

  it('should update searchVal and call employeesDetails', () => {
    serviceMock.getEmpDetails.mockReturnValue(of({ total: 0, data: [] }));
    component.onSearchValChange('Alice');
    const data: GridFeatures = {
      filter: { searchVal: 'Alice', deptVal: '', statusVal: '' },
      pagination: { page: 1, pageSize: 15 },
    };
    expect(serviceMock.getEmpDetails).toHaveBeenCalledExactlyOnceWith(data);
  });

  it('should update deptVal and call employeesDetails', () => {
    serviceMock.getEmpDetails.mockReturnValue(of({ total: 0, data: [] }));
    component.onDeptChange('HR');
    const data: GridFeatures = {
      filter: { searchVal: '', deptVal: 'HR', statusVal: '' },
      pagination: { page: 1, pageSize: 15 },
    };
    expect(serviceMock.getEmpDetails).toHaveBeenCalledExactlyOnceWith(data);
  });

  it('should update statusVal and call employeesDetails', () => {
    serviceMock.getEmpDetails.mockReturnValue(of({ total: 0, data: [] }));
    component.onStatusChange('Active');
    const data: GridFeatures = {
      filter: { searchVal: '', deptVal: '', statusVal: 'Active' },
      pagination: { page: 1, pageSize: 15 },
    };
    expect(serviceMock.getEmpDetails).toHaveBeenCalledExactlyOnceWith(data);
  });

  it('should update sort info and call employeesDetails', () => {
    const sortInfo: SortInformation = { col: 'name', order: 'asc' };
    serviceMock.getEmpDetails.mockReturnValue(of({ total: 0, data: [] }));
    component.onSort(sortInfo);
    const data: GridFeatures = {
      filter: { searchVal: '', deptVal: '', statusVal: '' },
      pagination: { page: 1, pageSize: 15 },
      sort: sortInfo,
    };
    expect(serviceMock.getEmpDetails).toHaveBeenCalledExactlyOnceWith(data);
  });

  it('should update pagination info and call employeesDetails', () => {
    const pagination: PaginationInfo = { page: 2, pageSize: 10 };
    serviceMock.getEmpDetails.mockReturnValue(of({ total: 0, data: [] }));
    component.onPaginationChange(pagination);
    const data: GridFeatures = {
      filter: { searchVal: '', deptVal: '', statusVal: '' },
      pagination: { page: 2, pageSize: 10 },
    };
    expect(serviceMock.getEmpDetails).toHaveBeenCalledExactlyOnceWith(data);
  });

  it('should update date and call employeesDetails', () => {
    serviceMock.getEmpDetails.mockReturnValue(of({ total: 0, data: [] }));
    component.OnDateChange('2026-06-08');
    const data: GridFeatures = {
      filter: { searchVal: '', deptVal: '', statusVal: '' },
      pagination: { page: 1, pageSize: 15 },
      date: '2026-06-08',
    };
    expect(serviceMock.getEmpDetails).toHaveBeenCalledExactlyOnceWith(data);
  });

  it('should set selected row data', () => {
    const row = { name: 'Jane', score: 95 };
    component.selectedRow(row);
    expect(component.selectedTopEmpData).toEqual(row);
  });

  it('should detect empty object', () => {
    expect(component.isEmpty({})).toBe(true);
    expect(component.isEmpty({ name: 'not empty' })).toBe(false);
  });

  it('should unsubscribe on destroy', async () => {
    const monthlyTrend$ = new Subject<MonthlyTrendProcessed[]>();
    serviceMock.getMonthlyTrend.mockReturnValue(monthlyTrend$);
    serviceMock.getDepartmentDetails.mockReturnValue(of([]));
    serviceMock.getGoalProgress.mockReturnValue(of([]));

    fixture.detectChanges(); // triggers ngOnInit

    monthlyTrend$.next([{ name: 'avg', series: [] }]);
    expect(component.monthlyTrendData.length).toBe(1);

    component.ngOnDestroy();
    monthlyTrend$.next([{ name: 'extra', series: [] }]);

    // wait a tick
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(component.monthlyTrendData.length).toBe(1); // unchanged after destroy
  });
});
