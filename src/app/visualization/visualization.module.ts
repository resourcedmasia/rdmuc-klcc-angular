import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReadActiveAlarmComponent } from './read-active-alarm/read-active-alarm.component';

@NgModule({
  declarations: [ReadActiveAlarmComponent],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
  	FormsModule,
  ],
  entryComponents: [
    
  ]
})
export class VisualizationModule { }
