import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { UserListComponent } from './user-list/user-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MxgraphEditComponent } from './mxgraph-edit.component';

import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    // UserListComponent,
    MxgraphEditComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule, 
    NgSelectModule,
  ],
  exports: [
    //	UserListComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    MxgraphEditComponent
  ]
})
export class MxgraphEditModule { }
