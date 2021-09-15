import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetAlarmCountersComponent } from './widget-alarm-counters/widget-alarm-counters.component';
import { WidgetGaugeComponent } from './widget-gauge/widget-gauge.component';
import { WidgetDonutComponent } from './widget-donut/widget-donut.component';
import { WidgetHeatmapComponent } from './widget-heatmap/widget-heatmap.component';

@NgModule({
  declarations: [
  	WidgetAlarmCountersComponent,
  	WidgetGaugeComponent,
  	WidgetDonutComponent,
  	WidgetHeatmapComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
  	WidgetAlarmCountersComponent,
    WidgetGaugeComponent,
    WidgetDonutComponent,
    WidgetHeatmapComponent,
  ]
})
export class OverviewModule { }
