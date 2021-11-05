import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetAlarmCountersComponent } from './widget-alarm-counters/widget-alarm-counters.component';
import { WidgetGaugeComponent } from './widget-gauge/widget-gauge.component';
import { WidgetDonutComponent } from './widget-donut/widget-donut.component';
import { WidgetHeatmapComponent } from './widget-heatmap/widget-heatmap.component';
import { TablePendingSubmissionComponent } from './table-pending-submission/table-pending-submission.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
  	WidgetAlarmCountersComponent,
  	WidgetGaugeComponent,
  	WidgetDonutComponent,
  	WidgetHeatmapComponent,
  	TablePendingSubmissionComponent,
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
  ],
  exports: [
  	WidgetAlarmCountersComponent,
    WidgetGaugeComponent,
    WidgetDonutComponent,
    WidgetHeatmapComponent,
    TablePendingSubmissionComponent,
  ]
})
export class OverviewModule { }
