import { Component, OnInit, signal } from '@angular/core';
import { Cards } from '@app/shared/components/cards/cards';
import { DashboardService } from './services/dashboard';
import { Kpi } from '@app/shared/models/kpi.model';
import { debounce, debounceTime, Observable, shareReplay, Subject, Subscription } from 'rxjs';
import { LineChart } from '@app/shared/components/line-chart/line-chart';
import { MonthlyTrendProcessed } from '@app/shared/models/monthly-trend-processed.model';
import { NameValueData } from '@app/shared/models/name-value.model';
import { VBarGraph } from '@app/shared/components/v-bar-graph/v-bar-graph';
import { DoughnutChart } from '@app/shared/components/doughnut-chart/doughnut-chart';
import { IEmployees } from '@app/shared/models/employees.model';
import { GridContainer } from '@app/shared/components/grid-container/grid-container';
import { SortInformation } from '@app/shared/models/sort-information.model';
import { GridFeatures } from '@app/shared/models/grid-features.model';
import { PaginationInfo } from '@app/shared/models/pagination.model';
import { HBarGraph } from '@app/shared/components/h-bar-graph/h-bar-graph';
import { CommonModule } from '@angular/common';
import { Theme } from '@app/core/services/theme';

@Component({
  selector: 'app-dashboard',
  imports: [Cards, LineChart, VBarGraph, DoughnutChart, GridContainer, HBarGraph, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  providers: [DashboardService],
})
export class Dashboard implements OnInit {
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
  public selectedTopEmpData: any = {};

  constructor(private dashboardService: DashboardService, private themeService: Theme) {}

  ngOnInit() {
    this.getAllData();
  }

  ngAfterViewInit() {
    this.themeService.isRefreshData.subscribe((res) => {
      if(res) {
       this.getAllData();
       this.selectedTopEmpData = {};
      }
    })
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

  public selectedRow(event: any) {
    this.selectedTopEmpData = event;
  }

  public isEmpty(obj: any) {
    return obj && Object.keys(obj).length === 0;
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
    this.employeesDetails$ = this.dashboardService.getEmpDetails(this.employeeFilterKeys).pipe(
      shareReplay(1)
    );
  }

  private topEmployeesScoreCompForEachDept(): void {
    this.topEmployeeComp$ = this.dashboardService.getTopEmployeesScoreCompForEachDept().pipe(
      shareReplay(1)
    );
  }

  ngOnDestroy() {
    this.monthlyTrendSubscription?.unsubscribe();
    this.deptDetailsSubscription?.unsubscribe();
    this.goalProgressSubscription?.unsubscribe();
  }
}
