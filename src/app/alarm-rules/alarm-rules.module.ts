import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleListComponent } from './rule-list/rule-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddRuleModalComponent } from './add-rule-modal/add-rule-modal.component';
import { ModifyRuleModalComponent } from './modify-rule-modal/modify-rule-modal.component';
import { DeleteRuleModalComponent } from './delete-rule-modal/delete-rule-modal.component';
import { AutosizeModule } from '../../vendor/libs/autosize/autosize.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
  	RuleListComponent,
  	AddRuleModalComponent,
  	ModifyRuleModalComponent,
  	DeleteRuleModalComponent,
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    AutosizeModule,
    NgSelectModule
  ],
  exports: [
  	RuleListComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    AddRuleModalComponent,
  	ModifyRuleModalComponent,
  	DeleteRuleModalComponent,
  ]
})
export class AlarmRulesModule { }
