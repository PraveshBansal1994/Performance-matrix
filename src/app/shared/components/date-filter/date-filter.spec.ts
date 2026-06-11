import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateFilter } from './date-filter';

describe('DateFilter Component', () => {
  let component: DateFilter;
  let fixture: ComponentFixture<DateFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(DateFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit dateChange when onDateChange is called', () => {
    const spy = vi.spyOn(component.dateChange, 'emit');
    const mockEvent = {
      target: { value: '2026-06-08' },
    } as unknown as Event;

    component.onDateChange(mockEvent);

    expect(spy).toHaveBeenCalledWith('2026-06-08');
  });

  it('should emit undefined if event target has no value', () => {
    const spy = vi.spyOn(component.dateChange, 'emit');
    const mockEvent = { target: {} } as unknown as Event;

    component.onDateChange(mockEvent);

    expect(spy).toHaveBeenCalledWith(undefined);
  });
});
