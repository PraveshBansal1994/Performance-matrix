import { Component, Input, input } from '@angular/core';
import { NameValueData } from '@app/shared/models/name-value.model';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-doughnut-chart',
  imports: [NgxChartsModule],
  templateUrl: './doughnut-chart.html',
  styleUrl: './doughnut-chart.scss',
})
export class DoughnutChart {
  @Input() data: NameValueData[] = [];

  single: NameValueData[] = [];

  // options
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = false;
  isDoughnut: boolean = true;
  legendPosition: string = 'below';

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#006BE6', '#00ce90', '#fc9b01', '#875fff', '#FF286D'],
  };

  constructor() {}

  ngOnInit() {
    this.single = this.data;
  }
}
