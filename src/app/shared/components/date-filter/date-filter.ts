import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-date-filter',
  imports: [],
  templateUrl: './date-filter.html',
  styleUrl: './date-filter.scss',
})
export class DateFilter {
  @Output() dateChange = new EventEmitter<string>();

  public onDateChange(event: Event): void {
    this.dateChange.emit((event?.target as HTMLInputElement)?.value);
  }
}
