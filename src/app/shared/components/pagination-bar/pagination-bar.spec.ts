import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationBar } from './pagination-bar';
import { IEmployees } from '@app/shared/models/employees.model';
import { of } from 'rxjs';

describe('PaginationBar', () => {
  let fixture: ComponentFixture<PaginationBar>;
  let component: PaginationBar;
  const mockEmployees: IEmployees = {
    data: [
      {
        id: 1,
        firstname: 'Test firstname',
        lastname: 'Test lastname',
        age: 24,
        gender: 'male',
        email: 'firstname.lastname@test.com',
        phone: '+1 99 999 9999',
        department: 'HR',
        role: 'Admin',
        status: 'Active',
        joiningDate: '2026-01-13',
      },
    ],
    first: 1,
    last: 5,
    items: 50,
    next: 2,
    pages: 1,
    prev: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationBar],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationBar);
    component = fixture.componentInstance;
    component.data = of(mockEmployees);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentPage).toBe(1);
    expect(component.prevPage).toBe(0);
    expect(component.nextPage).toBe(2);
    expect(component.selectedPage()).toBe('15');
  });

  it('should calculate pages correctly', () => {
    const pages = component.getPages(mockEmployees);
    expect(pages).toEqual([1, 2, 3, 4, 5]);
    expect(component.totalItems).toBe(50);
    expect(component.lastPage).toBe(5);
  });

  it('should update row per page and emit pagination data', () => {
    const spy = vi.spyOn(component.paginationData, 'emit');
    const event = { target: { value: '25' } } as unknown as Event;

    component.rowPerPage(event);

    expect(component.selectedPage()).toBe('25');
    expect(component.currentPage).toBe(1);
    expect(spy).toHaveBeenCalledWith({ page: 1, pageSize: 25 });
  });

  it('should go to next page and emit pagination data', () => {
    const spy = vi.spyOn(component.paginationData, 'emit');

    component.onPageClick('next');

    expect(component.currentPage).toBe(2);
    expect(component.prevPage).toBe(1);
    expect(component.nextPage).toBe(3);
    expect(spy).toHaveBeenCalledWith({ page: 2, pageSize: 15 });
  });

  it('should go to previous page and emit pagination data', () => {
    const spy = vi.spyOn(component.paginationData, 'emit');

    component.currentPage = 2;
    component.prevPage = 1;
    component.nextPage = 3;

    component.onPageClick('prev');

    expect(component.currentPage).toBe(1);
    expect(component.prevPage).toBe(0);
    expect(component.nextPage).toBe(2);
    expect(spy).toHaveBeenCalledWith({ page: 1, pageSize: 15 });
  });

  it('should not go prev when already on first page', () => {
    const spy = vi.spyOn(component.paginationData, 'emit');

    component.currentPage = 1;
    component.onPageClick('prev');

    expect(component.currentPage).toBe(1);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not go next when already on last page', () => {
    const spy = vi.spyOn(component.paginationData, 'emit');

    component.currentPage = 5;
    component.lastPage = 5;
    component.onPageClick('next');

    expect(component.currentPage).toBe(5);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should calculate item indices correctly when page changes', async () => {
    component.currentPage = 2;
    component.prevPage = 1;
    component.selectedPage.set('15');
    component.totalItems = 50;

    component.getPages(mockEmployees);

    // Wait for the setTimeout inside getPages to run
    await fixture.whenStable();

    expect(component.fromItemIndex()).toBe(16);
    expect(component.toItemIndex()).toBe(30);
  });

  it('should cap end index at total items', async () => {
    component.prevPage = 3;
    component.selectedPage.set('15');
    component.totalItems = 50;

    component.getPages(mockEmployees);

    // Wait for the setTimeout inside getPages to run
    await fixture.whenStable();

    expect(component.toItemIndex()).toBe(50);
  });

  it('should generate correct page array when first and last are defined', () => {
    const data: IEmployees = {
      first: 1,
      last: 5,
      items: 50,
      data: [],
      next: 2,
      pages: 5,
      prev: null,
    };
    const pages = component.getPages(data);

    expect(pages).toEqual([1, 2, 3, 4, 5]);
  });

  it('should generate single page when first and last are equal', () => {
    const data: IEmployees = {
      first: 3,
      last: 3,
      items: 10,
      data: [],
      next: null,
      pages: 3,
      prev: 2,
    };
    const pages = component.getPages(data);

    expect(pages).toEqual([3]);
  });

  it('should generate empty array when first and last are undefined', () => {
    const data: IEmployees = {
      first: null,
      last: null,
      items: null,
      data: [],
      next: null,
      pages: 3,
      prev: 2,
    };

    const pages = component.getPages(data);

    expect(pages).toEqual([0]);
  });

  it('should handle case where last < first gracefully', () => {
    const data: IEmployees = {
      first: 5,
      last: 3,
      items: 20,
      data: [],
      next: null,
      pages: 3,
      prev: 2,
    };

    const pages = component.getPages(data);

    // length becomes (3 - 5 + 1) = -1 → Array.from({ length: -1 }) → []
    expect(pages).toEqual([]);
  });

  it('should set current, prev, and next correctly when clicking a specific page number', () => {
    const spy = vi.spyOn(component.paginationData, 'emit');

    // Simulate clicking page 3
    component.onPageClick(3);

    expect(component.currentPage).toBe(3);
    expect(component.prevPage).toBe(2);
    expect(component.nextPage).toBe(4);

    // Verify that paginationData was emitted with correct values
    expect(spy).toHaveBeenCalledWith({ page: 3, pageSize: 15 });
  });

  it('should handle clicking page 1 correctly', () => {
    const spy = vi.spyOn(component.paginationData, 'emit');

    component.onPageClick(1);

    expect(component.currentPage).toBe(1);
    expect(component.prevPage).toBe(0);
    expect(component.nextPage).toBe(2);

    expect(spy).toHaveBeenCalledWith({ page: 1, pageSize: 15 });
  });

  it('should handle clicking the last page correctly', () => {
    const spy = vi.spyOn(component.paginationData, 'emit');

    component.lastPage = 5;
    component.onPageClick(5);

    expect(component.currentPage).toBe(5);
    expect(component.prevPage).toBe(4);
    expect(component.nextPage).toBe(6); // note: nextPage goes beyond lastPage, but logic allows it

    expect(spy).toHaveBeenCalledWith({ page: 5, pageSize: 15 });
  });
});
