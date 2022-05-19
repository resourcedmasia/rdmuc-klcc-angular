import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataAnalyticsViewerComponent } from './data-analytics-viewer/data-analytics-viewer.component';
import { NouisliderModule } from 'ng2-nouislider';

@NgModule({
  declarations: [
  	DataAnalyticsViewerComponent
  ],
  imports: [
  	NouisliderModule,
    CommonModule,
  ],
  exports: [
  	DataAnalyticsViewerComponent
  ],
  entryComponents: [
  	DataAnalyticsViewerComponent
  ]
})
export class DataAnalyticsModule { }
