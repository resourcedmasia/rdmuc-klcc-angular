import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';
import { DeleteUserModalComponent } from './delete-user-modal/delete-user-modal.component';
import { ModifyUserModalComponent } from './modify-user-modal/modify-user-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
  	UserListComponent,
  	AddUserModalComponent,
  	DeleteUserModalComponent,
  	ModifyUserModalComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  exports: [
  	UserListComponent,
  	FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    AddUserModalComponent,
    DeleteUserModalComponent,
    ModifyUserModalComponent
  ]
})
export class UserManagementModule { }
