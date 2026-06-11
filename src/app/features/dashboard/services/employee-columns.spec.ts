import { TestBed } from '@angular/core/testing';
import { EmployeeColumns } from './employee-columns';

describe('EmployeeColumns', () => {
  let service: EmployeeColumns;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeColumns],
    });
    service = TestBed.inject(EmployeeColumns);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the expected columns', () => {
    const expectedColumns = [
      'Employee',
      'Age',
      'Role',
      'Department',
      'Gender',
      'Joined On',
      'Phone',
      'Status',
    ];

    const result = service.getColumns();
    expect(result).toEqual(expectedColumns);
  });

  it('should contain specific column names', () => {
    const result = service.getColumns();
    expect(result).toContain('Employee');
    expect(result).toContain('Age');
    expect(result).toContain('Status');
  });

  it('should return exactly 8 columns', () => {
    const result = service.getColumns();
    expect(result.length).toBe(8);
  });
});
