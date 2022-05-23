import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDataPointComponent } from './modal-data-point/modal-data-point.component';

@NgModule({
  declarations: [ModalDataPointComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    ModalDataPointComponent
  ]
})
export class DataPointModule { }
