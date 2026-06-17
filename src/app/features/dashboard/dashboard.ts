import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Theme } from '@app/core/services/theme';
import { Cards } from '@app/shared/components/cards/cards';
import { DoughnutChart } from '@app/shared/components/doughnut-chart/doughnut-chart';
import { GridContainer } from '@app/shared/components/grid-container/grid-container';
import { HBarGraph } from '@app/shared/components/h-bar-graph/h-bar-graph';
import { LineChart } from '@app/shared/components/line-chart/line-chart';
import { VBarGraph } from '@app/shared/components/v-bar-graph/v-bar-graph';
import { IEmployees } from '@app/shared/models/employees.model';
import { GridFeatures } from '@app/shared/models/grid-features.model';
import { Kpi } from '@app/shared/models/kpi.model';
import { MonthlyTrendProcessed } from '@app/shared/models/monthly-trend-processed.model';
import { NameValueData } from '@app/shared/models/name-value.model';
import { PaginationInfo } from '@app/shared/models/pagination.model';
import { SortInformation } from '@app/shared/models/sort-information.model';
import { Observable, shareReplay, Subscription } from 'rxjs';
import { DashboardService } from './services/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [Cards, LineChart, VBarGraph, DoughnutChart, GridContainer, HBarGraph, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  providers: [DashboardService],
})
export class Dashboard implements OnInit, OnDestroy {
  private dashboardService = inject(DashboardService);
  private themeService = inject(Theme);
  private monthlyTrendSubscription!: Subscription;
  private deptDetailsSubscription!: Subscription;
  private goalProgressSubscription!: Subscription;
  private employeeFilterKeys: GridFeatures = {
    filter: {
      searchVal: '',
      deptVal: '',
      statusVal: '',
    },
    pagination: {
      page: 1,
      pageSize: 15,
    },
  };

  public kpisData$!: Observable<Kpi>;
  public monthlyTrendData: MonthlyTrendProcessed[] = [];
  public deptDetailsData: NameValueData[] = [];
  public goalProgressData: NameValueData[] = [];
  public employeesDetails$!: Observable<IEmployees>;
  public gridTitle = 'Employee';
  public gridSubTitle = 'Directory';
  public topEmployeeComp$!: Observable<NameValueData[]>;
  public selectedTopEmpData: NameValueData | null = null;

  ngOnInit() {
    this.getAllData();
    this.themeService.isRefreshData.subscribe((res) => {
      if (res) {
        this.getAllData();
        this.selectedTopEmpData = null;
      }
    });
  }

  public getAllData() {
    this.kpis();
    this.monthlyTrend();
    this.departmentDetails();
    this.goalProgress();
    this.employeesDetails();
    this.topEmployeesScoreCompForEachDept();
  }

  public onSearchValChange(val: string): void {
    this.employeeFilterKeys.filter.searchVal = val;
    this.employeesDetails();
  }

  public onDeptChange(val: string): void {
    this.employeeFilterKeys.filter.deptVal = val;
    this.employeesDetails();
  }

  public onStatusChange(val: string): void {
    this.employeeFilterKeys.filter.statusVal = val;
    this.employeesDetails();
  }

  public onSort(event: SortInformation): void {
    this.employeeFilterKeys.sort = event;
    this.employeesDetails();
  }

  public onPaginationChange(event: PaginationInfo): void {
    this.employeeFilterKeys.pagination = event;
    this.employeesDetails();
  }

  public OnDateChange(event: string): void {
    this.employeeFilterKeys.date = event;
    this.employeesDetails();
  }

  public selectedRow(event: NameValueData) {
    this.selectedTopEmpData = event;
  }

  private kpis(): void {
    this.kpisData$ = this.dashboardService.getKpis();
  }

  private monthlyTrend(): void {
    this.monthlyTrendSubscription = this.dashboardService.getMonthlyTrend().subscribe((res) => {
      this.monthlyTrendData = res;
    });
  }

  private departmentDetails(): void {
    this.deptDetailsSubscription = this.dashboardService.getDepartmentDetails().subscribe((res) => {
      this.deptDetailsData = res;
    });
  }

  private goalProgress(): void {
    this.goalProgressSubscription = this.dashboardService.getGoalProgress().subscribe((res) => {
      this.goalProgressData = res;
    });
  }

  private employeesDetails(): void {
    this.employeesDetails$ = this.dashboardService
      .getEmpDetails(this.employeeFilterKeys)
      .pipe(shareReplay(1));
  }

  private topEmployeesScoreCompForEachDept(): void {
    this.topEmployeeComp$ = this.dashboardService
      .getTopEmployeesScoreCompForEachDept()
      .pipe(shareReplay(1));
  }

  ngOnDestroy() {
    this.monthlyTrendSubscription?.unsubscribe();
    this.deptDetailsSubscription?.unsubscribe();
    this.goalProgressSubscription?.unsubscribe();
  }
}
