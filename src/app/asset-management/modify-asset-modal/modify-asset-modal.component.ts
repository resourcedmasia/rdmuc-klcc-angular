import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-modify-asset-modal',
  templateUrl: './modify-asset-modal.component.html',
  styleUrls: [
    './modify-asset-modal.component.scss'
  ]
})
export class ModifyAssetModalComponent implements OnInit {
  @Input() row: any;
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
  modifyAssetForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    site: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    additional_info: new FormControl(''),
    controllerids: new FormControl(''),
  });

  constructor(private restService: RestService, private authService: AuthService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    // Parse controllerids parameter if is set
    if (this.row.controllerids != "") {
      let controllernames = this.row.controllerids.map(function(obj) {
        return obj.name;
      });
      this.modifyAssetForm.patchValue({
          controllerids: controllernames
      });
    }    
    this.modifyAssetForm.patchValue({
      id: this.row.id,
      name: this.row.name,
      type: this.row.type,
      site: this.row.site,
      location: this.row.location,
      additional_info: this.row.additional_info
    });
    this.getControllers();
  }

  updateAsset() {
    // Add new asset
    this.restService.postData("updateAssetByID", this.authService.getToken(), {id: this.modifyAssetForm.value.id, name: this.modifyAssetForm.value.name, type: this.modifyAssetForm.value.type, site: this.modifyAssetForm.value.site, location: this.modifyAssetForm.value.location, additional_info: this.modifyAssetForm.value.additional_info, controllerids: this.modifyAssetForm.value.controllerids})
    .subscribe(data => {
    // Successful login
    if (data["status"] == 200) {
      this.modifyAssetForm.reset();
      this.valueChange.emit("getAssetsEvent");
    }
   })
  };

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
