import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-rule-modal',
  templateUrl: './add-rule-modal.component.html',
  styleUrls: [
    './add-rule-modal.component.scss'
  ]
})
export class AddRuleModalComponent implements OnInit {
  @Input() row: any;
  @Output() valueChange = new EventEmitter();

  // ng-select
  selectOptions = [];
  priority_selectOptions = [{"label": "CRITICAL", "value": "critical"}, {"label": "NON-CRITICAL", "value": "noncritical"}];

  // Form input (defaults)
  createRuleForm = new FormGroup({
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
    if (this.row && this.row.id) {
      this.createRuleForm.patchValue({
        site: this.row.siteid,
        controller: this.row.controller,
        title: this.row.title,
        reason: this.row.reason,
        priority: this.row.priority,
        mitigation: "",
      });
    }
    this.getAssets();
  }

  createRule() {
    // Add new asset
    this.restService.postData("createRule", this.authService.getToken(), {site: this.createRuleForm.value.site, controller: this.createRuleForm.value.controller, title: this.createRuleForm.value.title, reason: this.createRuleForm.value.reason, mitigation: this.createRuleForm.value.mitigation, assetids: this.createRuleForm.value.assetids, priority: this.createRuleForm.value.priority})
    .subscribe(data => {
      // Successful login
      if (data["status"] == 200) {
        this.createRuleForm.reset();
        this.valueChange.emit("getRulesEvent");
      }
    });
  }

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
          }, this);
        }
      });
  }
}
