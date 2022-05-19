import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetPerformanceReportComponent } from './asset-performance-report/asset-performance-report.component';
import { AssetPerformanceModalComponent } from './asset-performance-modal/asset-performance-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
  	AssetPerformanceReportComponent,
    AssetPerformanceModalComponent
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
  	AssetPerformanceReportComponent
  ],
  entryComponents: [AssetPerformanceModalComponent]
})
export class AssetPerformanceModule { }
