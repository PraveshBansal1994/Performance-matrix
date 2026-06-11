import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { NameValueData } from '@app/shared/models/name-value.model';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-h-bar-graph',
  imports: [NgxChartsModule],
  templateUrl: './h-bar-graph.html',
  styleUrl: './h-bar-graph.scss',
})
export class HBarGraph {
  @Input() data$!: Observable<NameValueData[]>;
  @Output() selectedData = new EventEmitter();

  public isBrowser: boolean;
  public chartData$!: Observable<NameValueData[]>;

  // options
  showXAxis: boolean = false;
  showYAxis: boolean = false;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  shoDataLabel: boolean = true;
  xAxisLabel: string = '';
  yAxisWidth: number = 5;

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#006BE6', '#00ce90', '#fc9b01', '#875fff', '#FF286D'],
  };
  style = 'fill: #e74c3c';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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
