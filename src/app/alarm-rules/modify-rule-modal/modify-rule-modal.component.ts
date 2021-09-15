import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-modify-rule-modal',
  templateUrl: './modify-rule-modal.component.html',
  styleUrls: [
    './modify-rule-modal.component.scss'
  ]
})
export class ModifyRuleModalComponent implements OnInit {
  @Input() row: any;
  @Output() valueChange = new EventEmitter();

  // ng-select
  selectOptions = [];
  priority_selectOptions = [{"label": "CRITICAL", "value": "critical"}, {"label": "NON-CRITICAL", "value": "noncritical"}];

  // Form input (defaults)
  modifyRuleForm = new FormGroup({
  	id: new FormControl(''),
    site: new FormControl('', Validators.required),
    controller: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    reason: new FormControl('', Validators.required),
    mitigation: new FormControl('', Validators.required),
    priority: new FormControl('critical', Validators.required),
    assetids: new FormControl(),
  });

  constructor(private restService: RestService, private authService: AuthService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    // Parse asset_id parameter if is set
    if (this.row.asset_id != "") {
      let selectedAssets = JSON.parse(this.row.asset_id);
      this.modifyRuleForm.patchValue({
          assetids: selectedAssets
      });
    }    
  	this.modifyRuleForm.patchValue({
  	  id: this.row.id,
  	  site: this.row.site,
      controller: this.row.controller,
      title: this.row.title,
      reason: this.row.reason,
      mitigation: this.row.mitigation,
      priority: this.row.priority,
  	});
    this.getAssets();
  }

  updateRule() {
    // Update existing rule
    this.restService.postData("updateRuleByID", this.authService.getToken(), {id: this.modifyRuleForm.value.id, site: this.modifyRuleForm.value.site, controller: this.modifyRuleForm.value.controller, title: this.modifyRuleForm.value.title, reason: this.modifyRuleForm.value.reason, mitigation: this.modifyRuleForm.value.mitigation, assetids: this.modifyRuleForm.value.assetids, priority: this.modifyRuleForm.value.priority})
    .subscribe(data => {
    // Successful login
    if (data["status"] == 200) {
      this.modifyRuleForm.reset();
      this.valueChange.emit("getRulesEvent");
    }
   })
  };

  getAssets() {
    // Get Assets
    this.restService.postData("getAssets", this.authService.getToken())
      .subscribe(data => {
      // Success
      if (data["status"] == 200) {
        this.selectOptions = data["data"].rows;
        // Create label from raw data
        this.selectOptions.forEach(function(element) {
          element.label = element.site + " / " + element.name;
          element.SELECTED = true;
        }, this);
      }
    });
  }
}
