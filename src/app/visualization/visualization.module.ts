import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetailGraphComponent } from './detail-graph/detail-graph.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
  	FormsModule,
  ],
  entryComponents: [
    
  ],
})
export class VisualizationModule { }
