import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownList } from './dropdown-list';
import { NameValueData } from '@app/shared/models/name-value.model';

describe('DropdownList Component', () => {
  let component: DropdownList;
  let fixture: ComponentFixture<DropdownList>;

  const mockData: NameValueData[] = [
    { name: 'Option A', value: 'A' },
    { name: 'Option B', value: 'B' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownList],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default inputs', () => {
    expect(component.title).toBe('');
    expect(component.data).toEqual([]);
  });

  it('should accept input data', () => {
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();
    expect(component.data.length).toBe(2);
    expect(component.data[0].name).toBe('Option A');
  });

  it('should emit selectedVal when onChange is called', () => {
    const spy = vi.spyOn(component.selectedVal, 'emit');
    const mockEvent = {
      target: { value: 'B' },
    } as unknown as Event;

    component.onChange(mockEvent);

    expect(spy).toHaveBeenCalledWith('B');
  });

  it('should emit undefined if event target has no value', () => {
    const spy = vi.spyOn(component.selectedVal, 'emit');
    const mockEvent = { target: {} } as unknown as Event;

    component.onChange(mockEvent);

    expect(spy).toHaveBeenCalledWith(undefined);
  });
});
