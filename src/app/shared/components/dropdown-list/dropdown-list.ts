import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NameValueData } from '@app/shared/models/name-value.model';

@Component({
  selector: 'app-dropdown-list',
  imports: [],
  templateUrl: './dropdown-list.html',
  styleUrl: './dropdown-list.scss',
})
export class DropdownList {
  @Input() title = '';
  @Input() data: NameValueData[] = [];
  @Output() selectedVal = new EventEmitter<string>();

  onChange(event: Event) {
    this.selectedVal.emit((event?.target as HTMLSelectElement)?.value);
  }
}
