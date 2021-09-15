import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetListComponent } from './asset-list/asset-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteAssetModalComponent } from './delete-asset-modal/delete-asset-modal.component';
import { AddAssetModalComponent } from './add-asset-modal/add-asset-modal.component';
import { ModifyAssetModalComponent } from './modify-asset-modal/modify-asset-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
  	AssetListComponent,
  	DeleteAssetModalComponent,
  	AddAssetModalComponent,
  	ModifyAssetModalComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  exports: [
  	AssetListComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    DeleteAssetModalComponent,
    AddAssetModalComponent,
    ModifyAssetModalComponent,
  ]
})
export class AssetManagementModule { }
