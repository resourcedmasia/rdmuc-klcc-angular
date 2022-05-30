import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CctvComponent } from './cctv/cctv.component';
import { EventCctvModalComponent } from './event-cctv-modal/event-cctv-modal.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CctvComponent, EventCctvModalComponent],
  imports: [
    CommonModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule
  ],  
  entryComponents: [
    EventCctvModalComponent
  ],
})
export class CctvModule { }
