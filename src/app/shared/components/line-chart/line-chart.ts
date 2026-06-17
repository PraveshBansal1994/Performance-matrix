import { Component, effect, inject, Input, OnInit } from '@angular/core';
import { Theme } from '@app/core/services/theme';
import { MonthlyTrendProcessed } from '@app/shared/models/monthly-trend-processed.model';
import { ThemeEnum } from '@app/shared/models/theme-config.model';
import { Color, LegendPosition, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-line-chart',
  imports: [NgxChartsModule],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss',
})
export class LineChart implements OnInit {
  @Input() data: MonthlyTrendProcessed[] = [];

  private themeService = inject(Theme);

  multi: MonthlyTrendProcessed[] = [];
  // options
  legend = false;
  showLabels = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  yAxisLabel = '';
  timeline = false;
  legendPosition: LegendPosition = LegendPosition.Below;
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#00e5a0', '#60a5fa'],
  };
  style = 'fill: #e74c3c';

  constructor() {
    effect(() => {
      const theme = this.themeService.theme();
      if (theme === ThemeEnum.Dark) {
        this.colorScheme.domain = ['#00e5a0', '#60a5fa'];
        this.style = 'fill: #e74c3c';
      } else {
        this.colorScheme.domain = ['#00ff40', '#0050b3'];
        this.style = 'fill: #FF0000';
      }
      this.multi = [...this.multi];
    });
  }

  ngOnInit() {
    this.multi = this.data;
  }
}
