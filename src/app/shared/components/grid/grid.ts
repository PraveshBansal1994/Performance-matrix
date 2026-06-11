import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { EmployeeColumns } from '@app/features/dashboard/services/employee-columns';
import { IEmployees } from '@app/shared/models/employees.model';
import { Observable } from 'rxjs';
import { PaginationBar } from '../pagination-bar/pagination-bar';
import { SortInformation } from '@app/shared/models/sort-information.model';
import { PaginationInfo } from '@app/shared/models/pagination.model';
import { PhoneFormatPipe } from '@app/shared/pipes/phone-format-pipe';

@Component({
  selector: 'app-grid',
  imports: [CommonModule, PaginationBar, PhoneFormatPipe],
  templateUrl: './grid.html',
  styleUrl: './grid.scss',
  providers: [EmployeeColumns],
})
export class Grid {
  @Input() data!: Observable<IEmployees>;
  @Output() sortInformation = new EventEmitter<SortInformation>();
  @Output() paginationData = new EventEmitter<PaginationInfo>();

  public sortCol = '';
  public sortOrder = '';
  public columns: string[];
  public dynamicClassName = signal('');

  constructor(private employeeColumnsService: EmployeeColumns) {
    this.columns = this.employeeColumnsService.getColumns();
  }

  public sortData(item: string): void {
    if (item === 'phone' || item === 'joined on') {
      return;
    }
    if (item === this.sortCol) {
      switch (this.sortOrder) {
        case '':
          this.sortOrder = 'asc';
          break;
        case 'asc':
          this.sortOrder = 'desc';
          break;
        case 'desc':
          this.sortOrder = '';
          break;
        default:
          this.sortOrder = '';
          break;
      }
    } else {
      this.sortCol = item;
      this.sortOrder = 'asc';
    }
    this.dynamicClassName.set(`sort${this.sortOrder}`);
    this.sortInformation.emit({ col: this.sortCol, order: this.sortOrder });
  }

  public paginationInfo(event: PaginationInfo): void {
    this.paginationData.emit(event);
  }
}
