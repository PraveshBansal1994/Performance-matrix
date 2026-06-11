import { Component, effect, Input } from '@angular/core';
import { Theme } from '@app/core/services/theme';
import { NameValueData } from '@app/shared/models/name-value.model';
import { ThemeEnum } from '@app/shared/models/theme-config.model';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-v-bar-graph',
  imports: [NgxChartsModule],
  templateUrl: './v-bar-graph.html',
  styleUrl: './v-bar-graph.scss',
})
export class VBarGraph {
  @Input() data: NameValueData[] = [];
  single: any[] = [];

  // options
  showXAxis = false;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#006BE6', '#00ce90', '#fc9b01', '#875fff', '#FF286D'],
  };
  style = 'fill: #e74c3c';

  constructor(private themeService: Theme) {
    effect(() => {
      const theme = this.themeService.theme();
      if (theme === ThemeEnum.Dark) {
        this.style = 'fill: #e74c3c';
      } else {
        this.style = 'fill: #FF0000';
      }
      this.single = [...this.single];
    });
  }

  ngOnInit() {
    this.single = this.data;
  }
}
