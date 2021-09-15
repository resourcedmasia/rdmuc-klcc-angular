import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnergyUsageSummaryComponent } from './energy-usage-summary/energy-usage-summary.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [EnergyUsageSummaryComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    NgSelectModule
  ],
  exports: [EnergyUsageSummaryComponent]
})
export class EnergyManagementModule { }
