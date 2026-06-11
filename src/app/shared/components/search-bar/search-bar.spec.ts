import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBar } from './search-bar';
import { By } from '@angular/platform-browser';

describe('SearchBar', () => {
  let fixture: ComponentFixture<SearchBar>;
  let component: SearchBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBar],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render input with provided placeholder', () => {
    // Set input BEFORE first detectChanges
    component.placeholder = 'Search employees...';
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.placeholder).toBe('Search employees...');
  });

  it('should emit valueChanged when typing in input', () => {
    const spy = vi.spyOn(component.valueChanged, 'emit');
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputEl.value = 'hello';
    inputEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'h' }));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('hello');
  });

  it('should emit empty string when input is cleared', () => {
    const spy = vi.spyOn(component.valueChanged, 'emit');
    fixture.detectChanges();

    const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputEl.value = '';
    inputEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Backspace' }));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('');
  });
});
