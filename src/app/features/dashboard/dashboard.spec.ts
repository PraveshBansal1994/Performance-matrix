import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Theme } from '@app/core/services/theme';
import { IEmployees } from '@app/shared/models/employees.model';
import { GridFeatures } from '@app/shared/models/grid-features.model';
import { Kpi } from '@app/shared/models/kpi.model';
import { MonthlyTrendProcessed } from '@app/shared/models/monthly-trend-processed.model';
import { PaginationInfo } from '@app/shared/models/pagination.model';
import { SortInformation } from '@app/shared/models/sort-information.model';
import { of, Subject } from 'rxjs';
import { Mocked } from 'vitest';
import { Dashboard } from './dashboard';
import { DashboardService } from './services/dashboard';

describe('Dashboard Component (Vitest)', () => {
  let fixture: ComponentFixture<Dashboard>;
  let component: Dashboard;
  let serviceMock: Partial<Mocked<DashboardService>>;
  let themeServiceMock: Theme;

  const mockData: IEmployees = {
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
      getKpis: vi.fn().mockReturnValue(of({} as Kpi)),
      getMonthlyTrend: vi.fn().mockReturnValue(of([])),
      getDepartmentDetails: vi.fn().mockReturnValue(of([])),
      getGoalProgress: vi.fn().mockReturnValue(of([])),
      getEmpDetails: vi.fn().mockReturnValue(of(mockData as IEmployees)),
      getTopEmployeesScoreCompForEachDept: vi.fn().mockReturnValue(of([])),
    };

    themeServiceMock = {
      isRefreshData: new EventEmitter<boolean>(),
      getTheme: vi.fn(),
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
      theme: () => 'dark',
    } as unknown as Theme;

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideAnimations()],
    })
      .overrideComponent(Dashboard, {
        set: {
          providers: [
            { provide: DashboardService, useValue: serviceMock },
            { provide: Theme, useValue: themeServiceMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllData and reset selectedTopEmpData when refresh emits true', () => {
    const spy = vi.spyOn(component, 'getAllData');

    fixture.detectChanges();

    component.selectedTopEmpData = { name: 'Test', value: 1 };

    themeServiceMock.isRefreshData.emit(true);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(component.selectedTopEmpData).toEqual(null);
  });

  it('should NOT call getAllData when refresh emits false', () => {
    const spy = vi.spyOn(component, 'getAllData');

    fixture.detectChanges();

    component.selectedTopEmpData = { name: 'Test', value: 70 };

    themeServiceMock.isRefreshData.emit(false);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.selectedTopEmpData).toEqual({ name: 'Test', value: 70 });
  });

  it('should handle multiple refresh emits', () => {
    const spy = vi.spyOn(component, 'getAllData');

    fixture.detectChanges();

    themeServiceMock.isRefreshData.emit(true);
    themeServiceMock.isRefreshData.emit(true);

    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should load KPI and other data on init', async () => {
    serviceMock.getKpis!.mockReturnValue(of({} as Kpi));
    serviceMock.getMonthlyTrend!.mockReturnValue(of([{ name: 'avg', series: [] }]));
    serviceMock.getDepartmentDetails!.mockReturnValue(of([{ name: 'HR', value: 50 }]));
    serviceMock.getGoalProgress!.mockReturnValue(of([{ name: 'Sales', value: '50.00' }]));
    serviceMock.getEmpDetails!.mockReturnValue(of(mockData));
    serviceMock.getTopEmployeesScoreCompForEachDept!.mockReturnValue(
      of([{ name: 'John', value: 90 }])
    );

    fixture.detectChanges(); // triggers ngOnInit

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(component.monthlyTrendData).toEqual([{ name: 'avg', series: [] }]);
    expect(component.deptDetailsData).toEqual([{ name: 'HR', value: 50 }]);
    expect(component.goalProgressData).toEqual([{ name: 'Sales', value: '50.00' }]);
    expect(component.kpisData$).toBeDefined();
    expect(component.employeesDetails$).toBeDefined();
    expect(component.topEmployeeComp$).toBeDefined();
  });

  it('should update searchVal and call employeesDetails', () => {
    serviceMock.getEmpDetails!.mockReturnValue(of({ total: 0, data: [] } as unknown as IEmployees));
    component.onSearchValChange('Alice');
    const data: GridFeatures = {
      filter: { searchVal: 'Alice', deptVal: '', statusVal: '' },
      pagination: { page: 1, pageSize: 15 },
    };
    expect(serviceMock.getEmpDetails).toHaveBeenCalledExactlyOnceWith(data);
  });

  it('should update deptVal and call employeesDetails', () => {
    serviceMock.getEmpDetails!.mockReturnValue(of({ total: 0, data: [] } as unknown as IEmployees));
    component.onDeptChange('HR');
    const data: GridFeatures = {
      filter: { searchVal: '', deptVal: 'HR', statusVal: '' },
      pagination: { page: 1, pageSize: 15 },
    };
    expect(serviceMock.getEmpDetails).toHaveBeenCalledExactlyOnceWith(data);
  });

  it('should update statusVal and call employeesDetails', () => {
    serviceMock.getEmpDetails!.mockReturnValue(of({ total: 0, data: [] } as unknown as IEmployees));
    component.onStatusChange('Active');
    const data: GridFeatures = {
      filter: { searchVal: '', deptVal: '', statusVal: 'Active' },
      pagination: { page: 1, pageSize: 15 },
    };
    expect(serviceMock.getEmpDetails).toHaveBeenCalledExactlyOnceWith(data);
  });

  it('should update sort info and call employeesDetails', () => {
    const sortInfo: SortInformation = { col: 'name', order: 'asc' };
    serviceMock.getEmpDetails!.mockReturnValue(of({ total: 0, data: [] } as unknown as IEmployees));
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
    serviceMock.getEmpDetails!.mockReturnValue(of({ total: 0, data: [] } as unknown as IEmployees));
    component.onPaginationChange(pagination);
    const data: GridFeatures = {
      filter: { searchVal: '', deptVal: '', statusVal: '' },
      pagination: { page: 2, pageSize: 10 },
    };
    expect(serviceMock.getEmpDetails).toHaveBeenCalledExactlyOnceWith(data);
  });

  it('should update date and call employeesDetails', () => {
    serviceMock.getEmpDetails!.mockReturnValue(of({ total: 0, data: [] } as unknown as IEmployees));
    component.OnDateChange('2026-06-08');
    const data: GridFeatures = {
      filter: { searchVal: '', deptVal: '', statusVal: '' },
      pagination: { page: 1, pageSize: 15 },
      date: '2026-06-08',
    };
    expect(serviceMock.getEmpDetails).toHaveBeenCalledExactlyOnceWith(data);
  });

  it('should set selected row data', () => {
    const row = { name: 'Jane', value: 95 };
    component.selectedRow(row);
    expect(component.selectedTopEmpData).toEqual(row);
  });

  it('should unsubscribe on destroy', async () => {
    const monthlyTrend$ = new Subject<MonthlyTrendProcessed[]>();
    serviceMock.getMonthlyTrend!.mockReturnValue(monthlyTrend$);
    serviceMock.getDepartmentDetails!.mockReturnValue(of([]));
    serviceMock.getGoalProgress!.mockReturnValue(of([]));

    serviceMock.getEmpDetails!.mockReturnValue(of({} as IEmployees));
    serviceMock.getTopEmployeesScoreCompForEachDept!.mockReturnValue(of([]));
    serviceMock.getKpis!.mockReturnValue(of({} as Kpi));

    fixture.detectChanges();

    monthlyTrend$.next([{ name: 'avg', series: [] }]);
    expect(component.monthlyTrendData.length).toBe(1);

    component.ngOnDestroy();
    monthlyTrend$.next([{ name: 'extra', series: [] }]);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(component.monthlyTrendData.length).toBe(1);
  });
});
