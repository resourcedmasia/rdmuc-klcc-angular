import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { MomentModule, FromUnixPipe, DateFormatPipe } from 'angular2-moment';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-view-alarm',
  templateUrl: './view-alarm.component.html',
  styleUrls: [
    './view-alarm.component.scss'
  ]
})
export class ViewAlarmComponent implements OnInit {
  @Input() row: any;

  // ng-select
  selectOptions = [];

  // table
  rows = [];

  // counters
  related_alarm_counter = 0;
  asset_information_counter = 0;

  // Form input (defaults)
  viewAlarmForm = new FormGroup({
    site: new FormControl(''),
    controller: new FormControl(''),
    title: new FormControl(''),
    reason: new FormControl(''),
    mitigation: new FormControl(''),
    assetids: new FormControl({value:'', disabled: true})
  });

  constructor(private restService: RestService, private authService: AuthService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    // Parse asset_id parameter if is set
    if (typeof this.row.rule[0].asset_id !== 'undefined' && this.row.rule[0].asset_id != "") {
      let selectedAssets = JSON.parse(this.row.rule[0].asset_id);
      this.viewAlarmForm.patchValue({
          assetids: selectedAssets
      });
    }
    this.viewAlarmForm.patchValue({
	    site: this.row.siteid,
        controller: this.row.controller,
        title: this.row.title,
        reason: this.row.reason,
        mitigation: this.row.rule[0].mitigation,
    });
    this.getAssets();
    this.getActiveAlarmsByController();
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
          element.SELECTED = true;
        }, this);
      }
    });
  }

  getActiveAlarmsByController() {
    // Get Assets
    this.restService.postData("getActiveAlarmsByController", this.authService.getToken(), {controller: this.row.controller})
      .subscribe(data => {
      // Success
      if (data["status"] == 200) {
        this.rows = data["data"].rows;
        this.rows.forEach(function(element) {
          element.status = '<span class="badge badge-warning">ACTIVE</span>';
          element.timestamp_converted = new DateFormatPipe().transform(new FromUnixPipe().transform(element.timestamp), 'LLLL');
         }, this);
        this.related_alarm_counter = this.rows.length;
      }
    });
  }
}
