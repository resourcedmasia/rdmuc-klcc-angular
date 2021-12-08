import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WriteVisualizationModalComponent } from './write-visualization-modal/write-visualization-modal.component';
import { FormsModule } from '@angular/forms';
import { VerifyUserModalComponent } from './verify-user-modal/verify-user-modal.component';

@NgModule({
  declarations: [WriteVisualizationModalComponent, VerifyUserModalComponent],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
  	FormsModule,
  ],
  entryComponents: [
    WriteVisualizationModalComponent,
    VerifyUserModalComponent]
})
export class VisualizationModule { }
