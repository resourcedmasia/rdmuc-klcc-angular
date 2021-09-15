import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MomentModule, FromUnixPipe, DateFormatPipe } from 'angular2-moment';

@Component({
  selector: 'app-asset-performance-modal',
  templateUrl: './asset-performance-modal.component.html',
  styleUrls: ['./asset-performance-modal.component.scss']
})
export class AssetPerformanceModalComponent implements OnInit {

  @Input() assetInfo: any;

  // table
  rows = [];

  // counters
  related_alarm_counter = 0;

  // ng-select
  selectOptions = [];
  type_selectOptions = [
    {"label": "HVAC - Chiller", "value": "HVAC - Chiller"},
    {"label": "HVAC - Cooling Tower", "value": "HVAC - Cooling Tower"},
    {"label": "HVAC - Pump", "value": "HVAC - Pump"},
    {"label": "HVAC - Air Handling Unit", "value": "HVAC - Air Handling Unit"},
    {"label": "HVAC - Fan Coil Unit", "value": "HVAC - Fan Coil Unit"},
    {"label": "HVAC - Valve", "value": "HVAC - Valve"},
    {"label": "HVAC - Filter", "value": "HVAC - Filter"},
    {"label": "HVAC - Motor", "value": "HVAC - Motor"},
    {"label": "HVAC - Sensor", "value": "HVAC - Sensor"},
    {"label": "HVAC - Others", "value": "HVAC - Others"},
    {"label": "Electrical - MSB", "value": "Electrical - MSB"},
    {"label": "Electrical - Lighting", "value": "Electrical - Lighting"},
    {"label": "Electrical - Others", "value": "Electrical - Others"},
    {"label": "Refrigeration - Chiller", "value": "Refrigeration - Chiller"},
    {"label": "Refrigeration - Freezer", "value": "Refrigeration - Freezer"},
    {"label": "Refrigeration - Compressor", "value": "Refrigeration - Compressor"},
    {"label": "Refrigeration - Condenser", "value": "Refrigeration - Condenser"},
    {"label": "Others", "value": "Others"},
  ];

  // Form input (defaults)
  viewAssetForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    type: new FormControl({value: '', disabled: true}),
    site: new FormControl(''),
    location: new FormControl(''),
    additional_info: new FormControl(''),
    controllerids: new FormControl({value: '', disabled: true}),
  });

  constructor(private restService: RestService, private authService: AuthService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    //console.log(this.assetInfo);
    this.getAssetInformation(this.assetInfo);
  }

  getAssetInformation(assetInfo) {
    // Get Assets
    this.restService.postData("getAssetByID", this.authService.getToken(), {id: assetInfo.id})
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          this.viewAssetForm.patchValue({
            id: data["data"]["rows"][0]["id"],
            name: data["data"]["rows"][0]["name"],
            type: data["data"]["rows"][0]["type"],
            site: data["data"]["rows"][0]["site"],
            location: data["data"]["rows"][0]["location"],
            additional_info: data["data"]["rows"][0]["additional_info"]
          });

          // Parse controllerids parameter if is set
          if (data["data"]["rows"][0]["controllerids"] != "") {
            let controllernames = data["data"]["rows"][0]["controllerids"].map(function(obj) {
              return obj.name;
            });
            this.viewAssetForm.patchValue({
              controllerids: controllernames
            });
          }
        }
    });

    // Get Alarms
    this.restService.postData("getDailyCriticalAlarmsByAssetID", this.authService.getToken(), {assetid: assetInfo.id, date: assetInfo.date})
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          //console.log(data);
          this.rows = data["data"]["rows"];
          this.rows.forEach(function(element) {
            element.timestamp_converted = new DateFormatPipe().transform(new FromUnixPipe().transform(element.timestamp), 'LLLL');
          }, this);
          this.related_alarm_counter = this.rows.length;
        }
    });
  }
}
