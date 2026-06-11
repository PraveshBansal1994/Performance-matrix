import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardApi } from './dashboard-api';
import { environment } from '@environments/environment';
import { GridFeatures } from '@app/shared/models/grid-features.model';
import { Kpi, KpiItem } from '@app/shared/models/kpi.model';
import { MonthlyTrendRaw } from '@app/shared/models/monthly-trend-raw.model';
import { DepartmentDetailsRaw } from '@app/shared/models/department-details-raw.model';
import { GoalProgressRaw } from '@app/shared/models/goal-progress-raw.model';
import { IEmployees } from '@app/shared/models/employees.model';
import { EmployeesComparision } from '@app/shared/models/employees-comparision.model';
import { provideHttpClient } from '@angular/common/http';

describe('DashboardApi (Angular v21)', () => {
  let service: DashboardApi;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DashboardApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch KPIs', () => {
    const mockResponse: Kpi = {
      avgScore: {} as KpiItem,
      topPerformer: {} as KpiItem,
      completedGoals: {} as KpiItem,
      teamMorale: {} as KpiItem,
    };

    service.getKPIs().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}getKPIs`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch Monthly Trend', () => {
    const mockResponse: MonthlyTrendRaw[] = [{ month: 'Jan', avg: 93, top: 100 }];

    service.getMonthlyTrend().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}getMonthlyTrend`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch Department Details', () => {
    const mockResponse: DepartmentDetailsRaw[] = [{ dept: 'HR', avg: 10, headCount: 30 }];

    service.getDepartmentDetails().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}getDepartmentDetails`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch Goal Progress', () => {
    const mockResponse: GoalProgressRaw[] = [{ goal: 'Sales', input: 50, total: 55 }];

    service.getGoalProgress().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}goalProgress`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should build URL correctly and fetch Employee Details', () => {
    const feature: GridFeatures = {
      pagination: { page: 1, pageSize: 10 },
      date: '2024-01-01',
      sort: { col: 'employee', order: 'asc' },
      filter: { searchVal: 'John', deptVal: 'HR', statusVal: 'Active' },
    };

    const mockResponse = {} as IEmployees;

    service.getEmpDetails(feature).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const expectedUrl =
      `${baseUrl}getEmployees?_page=1&_per_page=10&joiningDate=2024-01-01` +
      `&_sort=firstname&firstname:contains=John&department:eq=HR&status:eq=Active`;

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch Top Employees Score Comparison for each department', () => {
    const mockResponse: EmployeesComparision[] = [
      { name: 'Test', department: 'HR', score: 90 } as EmployeesComparision,
    ];

    service.getTopEmployeesScoreCompForEachDept().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}topEmployeesScoreComparisionEachDept`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return sort order for asc with non-employee column', () => {
    const feature: GridFeatures = {
      sort: { col: 'department', order: 'asc' },
      pagination: { page: 1, pageSize: 10 },
      filter: {
        searchVal: '',
        deptVal: '',
        statusVal: '',
      },
    };

    service.getEmpDetails(feature).subscribe();
    const expectedUrl = `${baseUrl}getEmployees?_page=1&_per_page=10&_sort=department`;

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush({} as IEmployees);
  });

  it('should return sort order for desc with employee column', () => {
    const feature: GridFeatures = {
      sort: { col: 'employee', order: 'desc' },
      pagination: { page: 1, pageSize: 10 },
      filter: {
        searchVal: '',
        deptVal: '',
        statusVal: '',
      },
    };

    service.getEmpDetails(feature).subscribe();
    const expectedUrl = `${baseUrl}getEmployees?_page=1&_per_page=10&_sort=-firstname`;

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush({} as IEmployees);
  });

  it('should return sort order for desc with non-employee column', () => {
    const feature: GridFeatures = {
      sort: { col: 'status', order: 'desc' },
      pagination: { page: 1, pageSize: 10 },
      filter: {
        searchVal: '',
        deptVal: '',
        statusVal: '',
      },
    };

    service.getEmpDetails(feature).subscribe();
    const expectedUrl = `${baseUrl}getEmployees?_page=1&_per_page=10&_sort=-status`;

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush({} as IEmployees);
  });

  it('should return undefined sort order when order is not asc/desc', () => {
    const feature: GridFeatures = {
      sort: { col: 'employee', order: 'none' },
      pagination: { page: 1, pageSize: 10 },
      filter: {
        searchVal: '',
        deptVal: '',
        statusVal: '',
      },
    };

    service.getEmpDetails(feature).subscribe();
    const expectedUrl = `${baseUrl}getEmployees?_page=1&_per_page=10`;

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush({} as IEmployees);
  });
});
