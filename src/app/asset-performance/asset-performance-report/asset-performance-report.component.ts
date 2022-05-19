import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { NgbDate, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AssetPerformanceModalComponent } from '../asset-performance-modal/asset-performance-modal.component';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'asset-performance-report',
  templateUrl: './asset-performance-report.component.html',
  styleUrls: ['./asset-performance-report.component.scss',
  '../../../vendor/libs/ngb-datepicker/ngb-datepicker.scss']
})
export class AssetPerformanceReportComponent implements OnInit, OnDestroy {
	minDateStart:NgbDateStruct;
 	maxDateStart:NgbDateStruct;
	dateStart:NgbDateStruct;
	selectedDate:NgbDateStruct;

	assetTypes = [{"label":"Day", "value":"day"}, {"label":"Week", "value":"week"}, {"label":"Month", "value":"month"}];
	selectedAssetType;

  assetPerformanceReportData;

  private assetModalRef;

  constructor(private restService: RestService, private authService: AuthService, private zone: NgZone, private modalService: NgbModal) {}

  ngOnInit() {
  	// Get all asset types
  	this.getAssetTypes();

  	// Set min/max date
  	this.restService.postData("getReportMinMaxDate", this.authService.getToken()).subscribe(data => {
        // Success
        if (data["status"] == 200) {
        	//Populate min/max date range
        	this.minDateStart = data["data"]["rows"]["minDate"];
        	this.maxDateStart = data["data"]["rows"]["maxDate"];
        	//Sets initial date to maxDate on page load
        	this.dateStart = this.maxDateStart;
        	this.selectedDate = this.dateStart;
        }
    });
  }

  ngOnDestroy() {
  }

  getAssetTypes() {
  	//Load asset types
      this.restService.postData("getAssetTypes", this.authService.getToken()).subscribe(data => {
          // Success
          if (data["status"] == 200) {
            // Populate asset type array
            this.assetTypes = data["data"].rows;
            // Copy return data into 'label' and 'value' subobjects for dropdown
            this.assetTypes.forEach(function(element) {
            	element.label = element["type"];
            	element.value = element["type"];
          	}, this);
          }
      });
  }

  onAssetTypeChange(event) {
  	this.selectedAssetType = event.type;

    if (this.selectedDate) {
      this.getAssetPerformanceReportData();
    }

  }

  onDateSelect(event) {
  	this.selectedDate = event;

    if (this.selectedAssetType) {
      this.getAssetPerformanceReportData();
    }
  	
  }

  // POST request to retrieve asset performance report data
  getAssetPerformanceReportData() {
  	this.restService.postData("generateAssetPerformanceReport", this.authService.getToken(), {assetType: this.selectedAssetType, date: this.selectedDate}).subscribe(data =>{
  		// Success
      if (data["status"] == 200) {
      	//console.log(data["data"]["rows"]);
        this.assetPerformanceReportData = data["data"]["rows"];

        for (let asset in this.assetPerformanceReportData) {
          this.assetPerformanceReportData[asset]["btnClass"] = "btn-success";
          if (this.assetPerformanceReportData[asset]["critical"] == true) {
            this.assetPerformanceReportData[asset]["btnClass"] = "btn-danger"
          }
        }
      }
  	});
  }

  displayAssetInfo(event, asset) {
    asset.date = this.selectedDate;
    event.target.parentElement.parentElement.blur(); // Fix for error on modal open
    this.assetModalRef = this.modalService.open(AssetPerformanceModalComponent, {size: 'lg'});
    this.assetModalRef.componentInstance.assetInfo = asset;
  }

}
