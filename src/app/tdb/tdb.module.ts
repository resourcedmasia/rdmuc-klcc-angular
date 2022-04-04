import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTdbModalComponent } from './add-tdb-modal/add-tdb-modal.component';
import { TdbComponent } from './tdb.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { DeleteTdbModalComponent } from './delete-tdb-modal/delete-tdb-modal.component';
import { UpdateTdbModalComponent } from './update-tdb-modal/update-tdb-modal.component';

@NgModule({
  declarations: [
    AddTdbModalComponent,
    TdbComponent,
    DeleteTdbModalComponent,
    UpdateTdbModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgxPaginationModule
  ],
  entryComponents: [
    AddTdbModalComponent,
    DeleteTdbModalComponent,
    UpdateTdbModalComponent
  ]
})
export class TdbModule { }
