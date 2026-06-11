export interface SubTitle {
  highlight: string;
  appendedData: string;
}

export interface KpiItem {
  data: string;
  unit: string;
  title: string;
  status: string;
  class: string;
  subTitle: SubTitle;
}

export interface Kpi {
  avgScore: KpiItem;
  topPerformer: KpiItem;
  completedGoals: KpiItem;
  teamMorale: KpiItem;
}
