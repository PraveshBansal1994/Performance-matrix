import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  @Input() placeholder = '';
  @Output() valueChanged = new EventEmitter<string>();

  public onKeyUp(event: KeyboardEvent) {
    this.valueChanged.emit((event?.target as HTMLInputElement)?.value);
  }
}
