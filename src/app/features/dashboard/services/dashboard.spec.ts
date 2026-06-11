import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { DashboardService } from './dashboard';
import { DashboardApi } from './dashboard-api';
import { Kpi, KpiItem } from '@app/shared/models/kpi.model';
import { MonthlyTrendRaw } from '@app/shared/models/monthly-trend-raw.model';
import { DepartmentDetailsRaw } from '@app/shared/models/department-details-raw.model';
import { GoalProgressRaw } from '@app/shared/models/goal-progress-raw.model';
import { IEmployees } from '@app/shared/models/employees.model';
import { GridFeatures } from '@app/shared/models/grid-features.model';
import { EmployeesComparision } from '@app/shared/models/employees-comparision.model';

describe('DashboardService', () => {
  let service: DashboardService;
  let apiMock: {
    getKPIs: ReturnType<typeof vi.fn>;
    getMonthlyTrend: ReturnType<typeof vi.fn>;
    getDepartmentDetails: ReturnType<typeof vi.fn>;
    getGoalProgress: ReturnType<typeof vi.fn>;
    getEmpDetails: ReturnType<typeof vi.fn>;
    getTopEmployeesScoreCompForEachDept: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiMock = {
      getKPIs: vi.fn(),
      getMonthlyTrend: vi.fn(),
      getDepartmentDetails: vi.fn(),
      getGoalProgress: vi.fn(),
      getEmpDetails: vi.fn(),
      getTopEmployeesScoreCompForEachDept: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [DashboardService, { provide: DashboardApi, useValue: apiMock }],
    });

    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return KPIs', () => {
    const mockKpi: Kpi = {
      avgScore: {} as KpiItem,
      topPerformer: {} as KpiItem,
      completedGoals: {} as KpiItem,
      teamMorale: {} as KpiItem,
    };
    apiMock.getKPIs.mockReturnValue(of(mockKpi));

    service.getKpis().subscribe((res) => {
      expect(res).toEqual(mockKpi);
    });
  });

  it('should process Monthly Trend data', () => {
    const raw: MonthlyTrendRaw[] = [{ month: 'Jan', avg: 10, top: 20 }];
    apiMock.getMonthlyTrend.mockReturnValue(of(raw));

    service.getMonthlyTrend().subscribe((res) => {
      expect(res[0].name).toBe('avg');
      expect(res[0].series[0]).toEqual({ name: 'Jan', value: 10 });
      expect(res[1].name).toBe('top');
      expect(res[1].series[0]).toEqual({ name: 'Jan', value: 20 });
    });
  });

  it('should handle error in Monthly Trend', () => {
    apiMock.getMonthlyTrend.mockReturnValue(throwError(() => new Error('fail')));

    service.getMonthlyTrend().subscribe((res) => {
      expect(res).toEqual([]);
    });
  });

  it('should process Department Details data', () => {
    const raw: DepartmentDetailsRaw[] = [{ dept: 'HR', avg: 50 } as DepartmentDetailsRaw];
    apiMock.getDepartmentDetails.mockReturnValue(of(raw));

    service.getDepartmentDetails().subscribe((res) => {
      expect(res).toEqual([{ name: 'HR', value: 50 }]);
    });
  });

  it('should handle error in Department Details', () => {
    apiMock.getDepartmentDetails.mockReturnValue(throwError(() => new Error('fail')));

    service.getDepartmentDetails().subscribe((res) => {
      expect(res).toEqual([]);
    });
  });

  it('should process Goal Progress data', () => {
    const raw: GoalProgressRaw[] = [{ goal: 'Sales', input: 50, total: 100 } as GoalProgressRaw];
    apiMock.getGoalProgress.mockReturnValue(of(raw));

    service.getGoalProgress().subscribe((res) => {
      expect(res).toEqual([{ name: 'Sales', value: '50.00' }]);
    });
  });

  it('should handle error in Goal Progress', () => {
    apiMock.getGoalProgress.mockReturnValue(throwError(() => new Error('fail')));

    service.getGoalProgress().subscribe((res) => {
      expect(res).toEqual([]);
    });
  });

  it('should return Employee Details directly from API', () => {
    const mockEmployees = {} as IEmployees;
    const feature: GridFeatures = {
      pagination: { page: 1, pageSize: 10 },
      filter: {},
    } as GridFeatures;
    apiMock.getEmpDetails.mockReturnValue(of(mockEmployees));

    service.getEmpDetails(feature).subscribe((res) => {
      expect(res).toEqual(mockEmployees);
    });
  });

  it('should process Top Employees Score Comparison', () => {
    const raw: EmployeesComparision[] = [{ name: 'John', score: 90 } as EmployeesComparision];
    apiMock.getTopEmployeesScoreCompForEachDept.mockReturnValue(of(raw));

    service.getTopEmployeesScoreCompForEachDept().subscribe((res) => {
      expect(res).toEqual([{ name: 'John', value: 90 }]);
    });
  });

  it('should handle error in Top Employees Score Comparison', () => {
    apiMock.getTopEmployeesScoreCompForEachDept.mockReturnValue(
      throwError(() => new Error('fail'))
    );

    service.getTopEmployeesScoreCompForEachDept().subscribe((res) => {
      expect(res).toEqual([]);
    });
  });
});
