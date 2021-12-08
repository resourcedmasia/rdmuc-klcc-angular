import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WriteVisualizationModalComponent } from './write-visualization-modal/write-visualization-modal.component';
import { FormsModule } from '@angular/forms';
import { VerifyUserModalComponent } from './verify-user-modal/verify-user-modal.component';
import { DeleteGraphModalComponent } from './delete-graph-modal/delete-graph-modal.component';
import { VerifyDeleteGraphModalComponent } from './verify-delete-graph-modal/verify-delete-graph-modal.component';

@NgModule({
  declarations: [WriteVisualizationModalComponent, VerifyUserModalComponent, DeleteGraphModalComponent, VerifyDeleteGraphModalComponent],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
  	FormsModule,
  ],
  entryComponents: [
    WriteVisualizationModalComponent,
    VerifyUserModalComponent,
    DeleteGraphModalComponent,
    VerifyDeleteGraphModalComponent]
})
export class VisualizationModule { }
