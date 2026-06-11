import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Grid } from './grid';
import { EmployeeColumns } from '@app/features/dashboard/services/employee-columns';
import { PaginationInfo } from '@app/shared/models/pagination.model';

class MockEmployeeColumns {
  getColumns() {
    return ['name', 'email', 'phone', 'joined on'];
  }
}

describe('Grid Component', () => {
  let component: Grid;
  let fixture: ComponentFixture<Grid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Grid],
    })
      .overrideComponent(Grid, {
        set: {
          providers: [{ provide: EmployeeColumns, useClass: MockEmployeeColumns }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Grid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize columns from EmployeeColumns service', () => {
    expect(component.columns).toEqual(['name', 'email', 'phone', 'joined on']);
  });

  it('should emit sortInformation with asc order when sorting a new column', () => {
    const spy = vi.spyOn(component.sortInformation, 'emit');
    component.sortData('name');
    expect(component.sortCol).toBe('name');
    expect(component.sortOrder).toBe('asc');
    expect(component.dynamicClassName()).toBe('sortasc');
    expect(spy).toHaveBeenCalledWith({ col: 'name', order: 'asc' });
  });

  it('should toggle sort order when sorting the same column repeatedly', () => {
    const spy = vi.spyOn(component.sortInformation, 'emit');

    component.sortData('email');
    expect(component.sortOrder).toBe('asc');
    expect(spy).toHaveBeenLastCalledWith({ col: 'email', order: 'asc' });

    component.sortData('email');
    expect(component.sortOrder).toBe('desc');
    expect(spy).toHaveBeenLastCalledWith({ col: 'email', order: 'desc' });

    component.sortData('email');
    expect(component.sortOrder).toBe('');
    expect(spy).toHaveBeenLastCalledWith({ col: 'email', order: '' });
  });

  it('should not sort when column is phone or joined on', () => {
    const spy = vi.spyOn(component.sortInformation, 'emit');
    component.sortData('phone');
    expect(spy).not.toHaveBeenCalled();

    component.sortData('joined on');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit paginationData when paginationInfo is called', () => {
    const spy = vi.spyOn(component.paginationData, 'emit');
    const mockPagination: PaginationInfo = { page: 2, pageSize: 10 };
    component.paginationInfo(mockPagination);
    expect(spy).toHaveBeenCalledWith(mockPagination);
  });

  it('should cycle sortOrder correctly when clicking the same column', () => {
    const spy = vi.spyOn(component.sortInformation, 'emit');

    expect(component.sortCol).toBe('');
    expect(component.sortOrder).toBe('');

    component.sortData('name');
    expect(component.sortOrder).toBe('asc');
    expect(component.dynamicClassName()).toBe('sortasc');
    expect(spy).toHaveBeenLastCalledWith({ col: 'name', order: 'asc' });

    component.sortData('name');
    expect(component.sortOrder).toBe('desc');
    expect(component.dynamicClassName()).toBe('sortdesc');
    expect(spy).toHaveBeenLastCalledWith({ col: 'name', order: 'desc' });

    component.sortData('name');
    expect(component.sortOrder).toBe('');
    expect(component.dynamicClassName()).toBe('sort');
    expect(spy).toHaveBeenLastCalledWith({ col: 'name', order: '' });

    component.sortData('name');
    expect(component.sortOrder).toBe('asc');
    expect(component.dynamicClassName()).toBe('sortasc');
    expect(spy).toHaveBeenLastCalledWith({ col: 'name', order: 'asc' });
  });

  it('should reset sortOrder to empty string when hitting default case', () => {
    const spy = vi.spyOn(component.sortInformation, 'emit');

    component.sortCol = 'name';
    component.sortOrder = 'invalid';

    component.sortData('name');

    expect(component.sortOrder).toBe('');
    expect(component.dynamicClassName()).toBe('sort');
    expect(spy).toHaveBeenCalledWith({ col: 'name', order: '' });
  });
});
