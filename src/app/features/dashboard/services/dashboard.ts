import { inject, Injectable } from '@angular/core';
import { DepartmentDetailsRaw } from '@app/shared/models/department-details-raw.model';
import { EmployeesComparision } from '@app/shared/models/employees-comparision.model';
import { IEmployees } from '@app/shared/models/employees.model';
import { GoalProgressRaw } from '@app/shared/models/goal-progress-raw.model';
import { GridFeatures } from '@app/shared/models/grid-features.model';
import { Kpi } from '@app/shared/models/kpi.model';
import { MonthlyTrendProcessed } from '@app/shared/models/monthly-trend-processed.model';
import { MonthlyTrendRaw } from '@app/shared/models/monthly-trend-raw.model';
import { NameValueData } from '@app/shared/models/name-value.model';
import { catchError, map, Observable, of } from 'rxjs';
import { DashboardApi } from './dashboard-api';

@Injectable()
export class DashboardService {
  private api = inject(DashboardApi);

  public getKpis(): Observable<Kpi> {
    return this.api.getKPIs();
  }

  public getMonthlyTrend(): Observable<MonthlyTrendProcessed[]> {
    return this.api.getMonthlyTrend().pipe(
      map((response: MonthlyTrendRaw[]) => {
        return this.processMonthlyTrendData(response);
      }),
      catchError((error) => {
        console.error('Error fetching monthly trend:', error);
        return of([]);
      })
    );
  }

  public getDepartmentDetails(): Observable<NameValueData[]> {
    return this.api.getDepartmentDetails().pipe(
      map((response: DepartmentDetailsRaw[]) => {
        return this.processDeptDetailsData(response);
      }),
      catchError((error) => {
        console.error('Error fetching department details:', error);
        return of([]);
      })
    );
  }

  public getGoalProgress(): Observable<NameValueData[]> {
    return this.api.getGoalProgress().pipe(
      map((response: GoalProgressRaw[]) => {
        return this.processGoalProgressData(response);
      }),
      catchError((error) => {
        console.error('Error fetching goal progress:', error);
        return of([]);
      })
    );
  }

  public getEmpDetails(filterKeys: GridFeatures): Observable<IEmployees> {
    return this.api.getEmpDetails(filterKeys);
  }

  public getTopEmployeesScoreCompForEachDept(): Observable<NameValueData[]> {
    return this.api.getTopEmployeesScoreCompForEachDept().pipe(
      map((response: EmployeesComparision[]) => {
        return response.map((item) => ({
          name: item.name,
          value: item.score,
        }));
      }),
      catchError((error) => {
        console.error('Error fetching employee comparision:', error);
        return of([]);
      })
    );
  }

  private processMonthlyTrendData(data: MonthlyTrendRaw[]): MonthlyTrendProcessed[] {
    return [
      {
        name: 'avg',
        series: data.map((item: MonthlyTrendRaw) => ({
          name: item.month,
          value: item.avg,
        })),
      },
      {
        name: 'top',
        series: data.map((item: MonthlyTrendRaw) => ({
          name: item.month,
          value: item.top,
        })),
      },
    ];
  }

  private processDeptDetailsData(data: DepartmentDetailsRaw[]): NameValueData[] {
    const refinedData: NameValueData[] = [];
    data.map((item: DepartmentDetailsRaw) => {
      const newData: NameValueData = { name: item.dept, value: item.avg };
      refinedData.push(newData);
    });
    return refinedData;
  }

  private processGoalProgressData(data: GoalProgressRaw[]): NameValueData[] {
    const refinedData: NameValueData[] = [];
    data.map((item: GoalProgressRaw) => {
      const newData: NameValueData = {
        name: item.goal,
        value: ((item.input / item.total) * 100).toFixed(2),
      };
      refinedData.push(newData);
    });
    return refinedData;
  }
}
