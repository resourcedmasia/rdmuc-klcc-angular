import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-asset-modal',
  templateUrl: './add-asset-modal.component.html',
  styleUrls: [
    './add-asset-modal.component.scss'
  ]
})
export class AddAssetModalComponent implements OnInit {
  @Output() valueChange = new EventEmitter();

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
  createAssetForm = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('Others', Validators.required),
    site: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    additional_info: new FormControl(''),
    controllerids: new FormControl(''),
  });

  constructor(private restService: RestService, private authService: AuthService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.getControllers();
  }

  createAsset() {
    // Add new asset
    this.restService.postData("createAsset", this.authService.getToken(), {name: this.createAssetForm.value.name, type: this.createAssetForm.value.type, site: this.createAssetForm.value.site, location: this.createAssetForm.value.location, additional_info: this.createAssetForm.value.additional_info, controllerids: this.createAssetForm.value.controllerids})
    .subscribe(data => {
      // Successful login
      if (data["status"] == 200) {
        this.createAssetForm.reset();
        this.valueChange.emit("getAssetsEvent");
      }
    });
  }

  getControllers() {
    // Get Assets
    this.restService.postData("getDatasetControllers", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          this.selectOptions = data["data"].rows;
        }
      });
  }
}
