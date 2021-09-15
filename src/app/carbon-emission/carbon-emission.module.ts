import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarbonEmissionReportComponent } from './carbon-emission-report/carbon-emission-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
  	CarbonEmissionReportComponent,
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
  	CarbonEmissionReportComponent,
  ],
  entryComponents: [
  	CarbonEmissionReportComponent,
  ]
})
export class CarbonEmissionModule { }
