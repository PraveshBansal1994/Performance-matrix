import { Injectable } from '@angular/core';

@Injectable()
export class EmployeeColumns {
  getColumns(): string[] {
    return ['Employee', 'Age', 'Role', 'Department', 'Gender', 'Joined On', 'Phone', 'Status'];
  }
}
