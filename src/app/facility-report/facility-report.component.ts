import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../app.service';
import { RestService } from '../rest.service';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-facility-report',
  templateUrl: './facility-report.component.html',
  styleUrls: [
    './facility-report.component.scss',
    '../../vendor/libs/ng2-archwizard/ng2-archwizard.scss'
  ]
})
export class FacilityReportComponent implements OnInit {
  dataSubmitted = false;
  reportSubmitted = false;

  facilityList = [];
  selectedFacility;
  selectedFacilityID;
  monthList = [];
  selectedMonth;

  row = [];

  // Form input (defaults)
  HVACForm = new FormGroup({
    total_complaints: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    total_breakdown: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
  });

  // Form input (defaults)
  IAQForm = new FormGroup({
    co2_ppm: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9][0-9]?)?$")]),
    co_ppm: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9][0-9]?)?$")]),
    formaldehyde_ppm: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9][0-9]?)?$")]),
    voc_ppm: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9][0-9]?)?$")]),
    temperature: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9][0-9]?)?$")]),
    relative_humidity: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+(\.[0-9][0-9]?)?$")]),
  });

  // Form input (defaults)
  GeneratorForm = new FormGroup({
    kick_in_timeliness: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
  });

  // Form input (defaults)
  WaterForm = new FormGroup({
    cont_water_disruption_hours: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
  });

  // Form input (defaults)
  HSSEForm = new FormGroup({
    covid19_cases: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    manhours: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    lti: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    ltif: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    lopc: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    major_fire: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
  });

  // Form input (defaults)
  VTSForm = new FormGroup({
    total_mantraps: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    total_breakdown: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
  });


  constructor(private restService: RestService, private authService: AuthService, private appService: AppService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.appService.pageTitle = 'Facility Report';
  }

  ngOnInit() {
    // Parse GET parameters in route (if any)
    this.activatedRoute.params.subscribe(params => {
      if (params["action"] == "createReport") {
        this.row = JSON.parse(params["row"]);
      }
    });
    
    // Populate month data
    let months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    let year = new Date().getFullYear();
    months.forEach(function (value, key) {
      this.monthList.push(value + " " + year);
    }, this);

    this.getFacilities();
  }

  // Get list of facilities from API
  getFacilities() {
    this.restService.postData("getFacilityList", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          this.facilityList = data["data"].rows;
          // Check if user was directed here via GET parameter
          if (this.row['facilityId']) {
            this.selectedFacilityID = this.row['facilityId'];
            this.selectedMonth = this.row['selectedMonth'];
            this.selectedFacility = this.row['facility'];
            this.checkReportSubmitted();
          }
          
        }
      });
  }

  // Check if a report is already submitted
  checkReportSubmitted() {
    this.reportSubmitted = false;
    if (!this.selectedMonth || !this.selectedFacilityID) {
      return false;
    }
    this.restService.postData("isFacilityReportSubmitted", this.authService.getToken(), {
      facilityId: this.selectedFacilityID,
      month: this.selectedMonth
    })
      .subscribe(data => {
        if (data["status"] == 200) {
          this.reportSubmitted = data["data"].rows;
        }
      });
  }

  // Submit facility report to API
  submitFacilityReport() {
    this.restService.postData("submitFacilityReport", this.authService.getToken(), {
      facility: this.selectedFacility,
      facilityId: this.selectedFacilityID,
      month: this.selectedMonth,

      generator_kick_in_timeliness: this.GeneratorForm.value.kick_in_timeliness,
      
      hsse_covid19_cases: this.HSSEForm.value.covid19_cases,
      hsse_manhours: this.HSSEForm.value.manhours,
      hsse_lti: this.HSSEForm.value.lti,
      hsse_ltif: this.HSSEForm.value.ltif,
      hsse_lopc: this.HSSEForm.value.lopc,
      hsse_major_fire: this.HSSEForm.value.major_fire,

      hvac_total_complaints: this.HVACForm.value.total_complaints,
      hvac_total_breakdown: this.HVACForm.value.total_breakdown,

      iaq_co2_ppm: this.IAQForm.value.co2_ppm,
      iaq_co_ppm: this.IAQForm.value.co_ppm,
      iaq_formaldehyde_ppm: this.IAQForm.value.formaldehyde_ppm,
      iaq_voc_ppm: this.IAQForm.value.voc_ppm,
      iaq_temperature: this.IAQForm.value.temperature,
      iaq_relative_humidity: this.IAQForm.value.relative_humidity,

      vts_total_mantraps: this.VTSForm.value.total_mantraps,
      vts_total_breakdown: this.VTSForm.value.total_breakdown,

      water_cont_water_disruption_hours: this.WaterForm.value.cont_water_disruption_hours
    })
    .subscribe(data => {
      if (data["status"] == 200) {
        // Navigate to acknowledgement page
        this.dataSubmitted = true;
        //this.router.navigate(['/dataentry/facility/complete']);
      }
    });
  }

  // Getters for form data (used in HTML template)
  get HVAC_total_complaints() {
    return this.HVACForm.get('total_complaints').value;
  }
  get HVAC_total_breakdown() {
    return this.HVACForm.get('total_breakdown').value;
  }

  get IAQ_co2_ppm() {
    return this.IAQForm.get('co2_ppm').value;
  }
  get IAQ_co_ppm() {
    return this.IAQForm.get('co_ppm').value;
  }
  get IAQ_formaldehyde_ppm() {
    return this.IAQForm.get('formaldehyde_ppm').value;
  }
  get IAQ_voc_ppm() {
    return this.IAQForm.get('voc_ppm').value;
  }
  get IAQ_temperature() {
    return this.IAQForm.get('temperature').value;
  }
  get IAQ_relative_humidity() {
    return this.IAQForm.get('relative_humidity').value;
  }

  get Generator_kick_in_timeliness() {
    return this.GeneratorForm.get('kick_in_timeliness').value;
  }

  get Water_cont_water_disruption_hours() {
    return this.WaterForm.get('cont_water_disruption_hours').value;
  }

  get HSSE_covid19_cases() {
    return this.HSSEForm.get('covid19_cases').value;
  }
  get HSSE_manhours() {
    return this.HSSEForm.get('manhours').value;
  }
  get HSSE_lti() {
    return this.HSSEForm.get('lti').value;
  }
  get HSSE_ltif() {
    return this.HSSEForm.get('ltif').value;
  }
  get HSSE_lopc() {
    return this.HSSEForm.get('lopc').value;
  }
  get HSSE_major_fire() {
    return this.HSSEForm.get('major_fire').value;
  }
}
