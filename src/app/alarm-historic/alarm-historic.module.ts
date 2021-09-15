import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoricAlarmsComponent } from './historic-alarms/historic-alarms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  declarations: [
  	HistoricAlarmsComponent,
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    TagInputModule,
  ],
  exports: [
  	HistoricAlarmsComponent,
    FormsModule
  ]
})
export class AlarmHistoricModule { }
