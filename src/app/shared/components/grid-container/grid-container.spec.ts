import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridContainer } from './grid-container';
import { NameValueData } from '@app/shared/models/name-value.model';
import { SortInformation } from '@app/shared/models/sort-information.model';
import { PaginationInfo } from '@app/shared/models/pagination.model';
import { of } from 'rxjs';
import { IEmployees } from '@app/shared/models/employees.model';

describe('GridContainer Component', () => {
  let component: GridContainer;
  let fixture: ComponentFixture<GridContainer>;

  const mockEmployees: IEmployees = {
    data: [
      {
        id: 1,
        firstname: 'firstname',
        lastname: 'lastname',
        age: 23,
        gender: 'female',
        email: 'email@test.com',
        phone: '+1 22 333 4444',
        department: 'Engineering',
        role: 'Admin',
        status: 'Active',
        joiningDate: '2026-06-07',
      },
    ],
    first: 1,
    items: 1,
    last: 1,
    next: 1,
    pages: 1,
    prev: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(GridContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default inputs', () => {
    expect(component.title).toBe('');
    expect(component.subTitle).toBe('');
    expect(component.filterListData).toEqual([]);
    expect(component.searchBarPlaceholder).toBe('Search name');
    expect(component.statusData).toEqual([
      { name: 'active', value: 'active' },
      { name: 'inactive', value: 'inactive' },
    ]);
  });

  it('should accept data input as observable', () => {
    component.data = of(mockEmployees);
    let result: IEmployees | undefined;
    component.data.subscribe((val) => (result = val));
    expect(result).toEqual(mockEmployees);
  });

  it('should emit searchValChanged when searchVal is called', () => {
    const spy = vi.spyOn(component.searchValChanged, 'emit');
    component.searchVal('Alice');
    expect(spy).toHaveBeenCalledWith('Alice');
  });

  it('should emit dropdownSelectedDeptVal when dropdownValDept is called', () => {
    const spy = vi.spyOn(component.dropdownSelectedDeptVal, 'emit');
    component.dropdownValDept('Finance');
    expect(spy).toHaveBeenCalledWith('Finance');
  });

  it('should emit dropdownSelectedStatusVal when dropdownValStatus is called', () => {
    const spy = vi.spyOn(component.dropdownSelectedStatusVal, 'emit');
    component.dropdownValStatus('inactive');
    expect(spy).toHaveBeenCalledWith('inactive');
  });

  it('should emit sortInformation when sortInfoVal is called', () => {
    const spy = vi.spyOn(component.sortInformation, 'emit');
    const sortInfo: SortInformation = { col: 'name', order: 'asc' };
    component.sortInfoVal(sortInfo);
    expect(spy).toHaveBeenCalledWith(sortInfo);
  });

  it('should emit paginationData when paginationInfo is called', () => {
    const spy = vi.spyOn(component.paginationData, 'emit');
    const pagination: PaginationInfo = { page: 1, pageSize: 20 };
    component.paginationInfo(pagination);
    expect(spy).toHaveBeenCalledWith(pagination);
  });

  it('should emit OnDateChange when dateChange is called', () => {
    const spy = vi.spyOn(component.OnDateChange, 'emit');
    component.dateChange('2026-06-08');
    expect(spy).toHaveBeenCalledWith('2026-06-08');
  });
});
