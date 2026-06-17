import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownList } from '@app/shared/components/dropdown-list/dropdown-list';
import { SearchBar } from '@app/shared/components/search-bar/search-bar';
import { IEmployees } from '@app/shared/models/employees.model';
import { NameValueData } from '@app/shared/models/name-value.model';
import { PaginationInfo } from '@app/shared/models/pagination.model';
import { SortInformation } from '@app/shared/models/sort-information.model';
import { exportToCSV } from '@app/shared/utils/export.util';
import { firstValueFrom, Observable } from 'rxjs';
import { DateFilter } from '../date-filter/date-filter';
import { Grid } from '../grid/grid';

@Component({
  selector: 'app-grid-container',
  imports: [SearchBar, DropdownList, Grid, CommonModule, DateFilter],
  templateUrl: './grid-container.html',
  styleUrl: './grid-container.scss',
})
export class GridContainer {
  @Input() title = '';
  @Input() subTitle = '';
  @Input() filterListData: NameValueData[] = [];
  @Input() data!: Observable<IEmployees>;
  @Output() searchValChanged = new EventEmitter<string>();
  @Output() dropdownSelectedDeptVal = new EventEmitter<string>();
  @Output() dropdownSelectedStatusVal = new EventEmitter<string>();
  @Output() sortInformation = new EventEmitter<SortInformation>();
  @Output() paginationData = new EventEmitter<PaginationInfo>();
  @Output() OnDateChange = new EventEmitter<string>();

  public searchBarPlaceholder = 'Search name';
  public statusData: NameValueData[] = [
    { name: 'active', value: 'active' },
    { name: 'inactive', value: 'inactive' },
  ];

  public searchVal(val: string): void {
    this.searchValChanged.emit(val);
  }

  public dropdownValDept(val: string): void {
    this.dropdownSelectedDeptVal.emit(val);
  }

  public dropdownValStatus(val: string): void {
    this.dropdownSelectedStatusVal.emit(val);
  }

  public sortInfoVal(event: SortInformation): void {
    this.sortInformation.emit(event);
  }

  public paginationInfo(event: PaginationInfo): void {
    this.paginationData.emit(event);
  }

  public dateChange(event: string): void {
    this.OnDateChange.emit(event);
  }

  public async exportData(): Promise<void> {
    const res = await firstValueFrom(this.data);
    exportToCSV(res.data, 'Employees.csv');
  }
}
