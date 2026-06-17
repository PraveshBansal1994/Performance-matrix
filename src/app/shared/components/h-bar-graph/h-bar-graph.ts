import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { NameValueData } from '@app/shared/models/name-value.model';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-h-bar-graph',
  imports: [NgxChartsModule],
  templateUrl: './h-bar-graph.html',
  styleUrl: './h-bar-graph.scss',
})
export class HBarGraph implements OnInit {
  @Input() data$!: Observable<NameValueData[]>;
  @Output() selectedData = new EventEmitter();

  private platformId = inject(PLATFORM_ID);

  public isBrowser: boolean;
  public chartData$!: Observable<NameValueData[]>;

  // options
  showXAxis = false;
  showYAxis = false;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  yAxisLabel = '';
  showYAxisLabel = true;
  shoDataLabel = true;
  xAxisLabel = '';
  yAxisWidth = 5;

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#006BE6', '#00ce90', '#fc9b01', '#875fff', '#FF286D'],
  };
  style = 'fill: #e74c3c';

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.chartData$ = this.data$;
    }
  }

  onSelect(data: Event): void {
    this.selectedData.emit(JSON.parse(JSON.stringify(data)));
  }
}
