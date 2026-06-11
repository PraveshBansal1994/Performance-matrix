import { EmployeeFilter } from './employee-filter.model';
import { PaginationInfo } from './pagination.model';
import { SortInformation } from './sort-information.model';

export interface GridFeatures {
  filter: EmployeeFilter;
  date?: string;
  sort?: SortInformation;
  pagination?: PaginationInfo;
}
