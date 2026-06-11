import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Kpi } from '@app/shared/models/kpi.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cards',
  imports: [CommonModule],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
})
export class Cards {
  @Input() data!: Observable<Kpi>;
}
