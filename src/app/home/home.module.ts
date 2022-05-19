import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActiveAlarmsComponent } from './active-alarms/active-alarms.component';
import { ActiveAlarmsModule } from './active-alarms/active-alarms.module';

import { AlarmStatsComponent } from './alarm-stats/alarm-stats.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ViewAlarmComponent } from './view-alarm/view-alarm.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from '../../vendor/libs/autosize/autosize.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
  	ActiveAlarmsComponent,
    AlarmStatsComponent,
    ViewAlarmComponent,
  ],
  imports: [
    CommonModule,
    ActiveAlarmsModule,
    NgxDatatableModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    AutosizeModule,
    NgbModule,
    NgSelectModule
  ],
  exports: [
  	ActiveAlarmsComponent,
    AlarmStatsComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    ViewAlarmComponent,
  ]
})
export class HomeModule { }