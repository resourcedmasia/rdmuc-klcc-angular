import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalDataPointComponent } from "./modal-data-point/modal-data-point.component";
import { ListDataPointComponent } from "./list-data-point/list-data-point.component";
import { DataPointMultipleTabComponent } from "./data-point-multiple-tab/data-point-multiple-tab.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DeleteModalDataPointComponent } from "./delete-modal-data-point/delete-modal-data-point.component";
import { ModifyDataPointComponentComponent } from "./modify-data-point-component/modify-data-point-component.component";

@NgModule({
  declarations: [
    ModalDataPointComponent,
    ListDataPointComponent,
    DataPointMultipleTabComponent,
    DeleteModalDataPointComponent,
    ModifyDataPointComponentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxDatatableModule,
  ],
  entryComponents: [
    ModalDataPointComponent,
    DeleteModalDataPointComponent,
    ModifyDataPointComponentComponent,
  ],
})
export class DataPointModule {}
