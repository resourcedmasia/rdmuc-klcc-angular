import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTdbModalComponent } from './add-tdb-modal/add-tdb-modal.component';
import { TdbComponent } from './tdb.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { DeleteTdbModalComponent } from './delete-tdb-modal/delete-tdb-modal.component';

@NgModule({
  declarations: [
    AddTdbModalComponent,
    TdbComponent,
    DeleteTdbModalComponent
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
    DeleteTdbModalComponent
  ]
})
export class TdbModule { }
