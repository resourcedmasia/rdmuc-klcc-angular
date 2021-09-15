import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnergyIndexReportComponent } from './energy-index-report/energy-index-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
  	EnergyIndexReportComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  exports: [
  	EnergyIndexReportComponent,
  ],
  entryComponents: [
  	EnergyIndexReportComponent
  ]
})
export class EnergyIndexModule { }
