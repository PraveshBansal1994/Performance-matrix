import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DepartmentDetailsRaw } from '@app/shared/models/department-details-raw.model';
import { EmployeesComparision } from '@app/shared/models/employees-comparision.model';
import { IEmployees } from '@app/shared/models/employees.model';
import { GoalProgressRaw } from '@app/shared/models/goal-progress-raw.model';
import { GridFeatures } from '@app/shared/models/grid-features.model';
import { Kpi } from '@app/shared/models/kpi.model';
import { MonthlyTrendRaw } from '@app/shared/models/monthly-trend-raw.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardApi {
  private http = inject(HttpClient);
  private basUrl = environment.apiUrl;

  // GET requests
  getKPIs(): Observable<Kpi> {
    return this.http.get<Kpi>(`${this.basUrl}getKPIs`);
  }

  getMonthlyTrend(): Observable<MonthlyTrendRaw[]> {
    return this.http.get<MonthlyTrendRaw[]>(`${this.basUrl}getMonthlyTrend`);
  }

  getDepartmentDetails(): Observable<DepartmentDetailsRaw[]> {
    return this.http.get<DepartmentDetailsRaw[]>(`${this.basUrl}getDepartmentDetails`);
  }

  getGoalProgress(): Observable<GoalProgressRaw[]> {
    return this.http.get<GoalProgressRaw[]>(`${this.basUrl}goalProgress`);
  }

  getEmpDetails(feature: GridFeatures): Observable<IEmployees> {
    let url = `${this.basUrl}getEmployees`;
    url += this.getPaginationAppendedUrl(feature);
    if (feature?.date) {
      url += this.getDateFiter(feature);
    }
    const sort = this.getSortOrder(feature);
    if (sort) {
      url += `&_sort=${sort}`;
    }
    url += this.getFiltersAppendedUrl(feature);

    return this.http.get<IEmployees>(url);
  }

  getTopEmployeesScoreCompForEachDept(): Observable<EmployeesComparision[]> {
    return this.http.get<EmployeesComparision[]>(
      `${this.basUrl}topEmployeesScoreComparisionEachDept`
    );
  }

  private getDateFiter(feature: GridFeatures): string {
    return `&joiningDate=${feature.date}`;
  }

  private getPaginationAppendedUrl(feature: GridFeatures): string {
    return `?_page=${feature.pagination?.page}&_per_page=${feature.pagination?.pageSize}`;
  }

  private getSortOrder(feature: GridFeatures): string | undefined {
    switch (feature?.sort?.order) {
      case 'asc':
        return feature.sort.col === 'employee' ? 'firstname' : feature.sort.col;
      case 'desc':
        return `-${feature.sort.col === 'employee' ? 'firstname' : feature.sort.col}`;
      default:
        return undefined;
    }
  }

  private getFiltersAppendedUrl(feature: GridFeatures): string {
    const filterKeys = feature.filter;
    let url = '';
    if (filterKeys.searchVal) {
      url += `&firstname:contains=${filterKeys.searchVal}`;
    }

    if (filterKeys.deptVal) {
      url += `&department:eq=${filterKeys.deptVal}`;
    }
    if (filterKeys.statusVal) {
      url += `&status:eq=${filterKeys.statusVal}`;
    }
    return url;
  }
}
