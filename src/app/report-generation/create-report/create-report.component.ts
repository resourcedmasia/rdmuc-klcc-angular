import { Component, OnInit, OnDestroy, NgZone, ElementRef, ViewChild } from '@angular/core';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.scss',
  '../../../vendor/libs/ngb-datepicker/ngb-datepicker.scss']
})
export class CreateReportComponent implements OnInit, OnDestroy {

	minDate:NgbDateStruct;
 	maxDate:NgbDateStruct;
	date:NgbDateStruct;
  reportType = [];
  assetReport;
  selectedReportType = "";
	assetType = [];
	assetList = [];
  selectedAssetType;
  selectedAssets;
	multipleSelectValue: Array<any> = [];
	model: NgbDateStruct = {
		year: new Date().getFullYear(),
		month: new Date().getMonth() + 1,
		day: new Date().getDate()
	};
  eodTableData = [];
  eodTableKeys = [];

  paretoData;

  paretoTableEnabled:boolean = false;
  assetIdParetoTableEnabled:boolean = false;
  alarmReasonParetoTableEnabled:boolean = false;
  paretoTableData;
  assetIdParetoTableData;
  alarmReasonParetoTableData;

  assetIdPareto: boolean = false;
  alarmReasonPareto: boolean = false;

  lastSelectedAssetType; // Storage variable for last clicked assettype event
  lastSelectedAssetID; // Storage variable for last clicked assetid event

  assetTypeFilter;
  assetIDFilter;
  dateRange;

  private chart: am4charts.XYChart;

  private chartdiv: ElementRef;

  constructor(private restService: RestService, private authService: AuthService, private zone: NgZone, private route: ActivatedRoute) { }

  ngOnInit() {
    //Set amcharts theme
    am4core.useTheme(am4themes_animated);

    //Load initial report types (hardcoded for now)
    this.reportType = ["EOD Report","Fault Analysis Report"];

    //Load initial date min max
    this.restService.postData("getReportMinMaxDate", this.authService.getToken()).subscribe(data =>{
    // Success
        if (data["status"] == 200) {
           //Populate min/max date range
          this.minDate = data["data"]["rows"]["minDate"];
          this.maxDate = data["data"]["rows"]["maxDate"];
          //Sets initial date to maxDate on page load
          this.date = this.maxDate;

          //Check query params and load initial reports
          this.route.queryParams
            .filter(params => params.type)
            .subscribe(params => {
              
              if (params.type == "faultanalysis") {
                this.selectedReportType = "Fault Analysis Report";
                this.onReportTypeChange("Fault Analysis Report");
              } else {
                this.selectedReportType = "EOD Report";
                this.onReportTypeChange("EOD Report");

                // Auto populate initial report code
                this.selectedAssetType = "HVAC - Chiller";
                this.onAssetTypeChange({type: "HVAC - Chiller"});
                // Send initial asset type, receive initial assets list, select all assets
                this.restService.postData("getAssetByType", this.authService.getToken(), {type: "HVAC - Chiller"}).subscribe(data =>{
                  // Success
                  if (data["status"] == 200) {
                    setTimeout(()=>{
                      // Append additional_info to asset name - eg. 300020218 (CHILLER 1)
                      let newAssetList = data["data"].rows;
                      newAssetList.forEach(function (asset) {
                        asset.label = asset.name + " (" + asset.additional_info + ")";
                      });
                      // Populate asset type array
                      this.assetList = newAssetList;
                      //Select all assets initially
                      this.selectedAssets = this.assetList;
                      this.retrieveEODData();
                    }, 1000)
                  }
                });

              }

          });
        }
    });
  }

  //Bind to #chartdiv reference
  // @ViewChild('chartdiv') set content(content: ElementRef) {
  //   //Generate chart only when chartdiv div DOM exists
  //   if (content) {
      
  //   }
  // }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  onReportTypeChange(event) {
  	this.selectedReportType = event;

    if (event == "EOD Report") {
      //Set report type to be "asset type"
      this.assetReport = true;
      this.assetIdPareto = false;
      this.alarmReasonPareto = false;

      //Load asset types
      this.restService.postData("getAssetTypes", this.authService.getToken()).subscribe(data => {
          // Success
          if (data["status"] == 200) {
            // Filter unwanted asset types
            let filteredAssets = data["data"].rows.filter(function(assettype) {
              if (assettype.type == "HVAC - Chiller" || assettype.type == "HVAC - Cooling Tower" || assettype.type == "Electrical - MSB" || assettype.type == "Others") {
                return assettype;
              }
            });
            // Populate asset type array
            this.assetType = filteredAssets;
          }
      });
    } else {
      this.assetReport = false;

      this.retrieveParetoData();
    }
  }

  onAssetTypeChange(event) {
  	// Send asset type, receive assets list
  	this.restService.postData("getAssetByType", this.authService.getToken(), {type: event.type}).subscribe(data =>{
		// Success
        if (data["status"] == 200) {
          // Append additional_info to asset name - eg. 300020218 (CHILLER 1)
          let newAssetList = data["data"].rows;
          newAssetList.forEach(function (asset) {
            asset.label = asset.name + " (" + asset.additional_info + ")";
          });
       	  // Populate asset type array
          this.assetList = newAssetList;
          
          //Clear previously selected assets
          this.selectedAssets = [];
        }
	  });
  }

  onAssetChange() {
    this.retrieveEODData();
  }

  onDateSelect(event) {
  	this.date = event;

    if(this.selectedReportType == "EOD Report") {
      //Call onAssetChange again on date change to apply the new date with other existing params
      this.onAssetChange();
    } else if (this.selectedReportType == "Fault Analysis Report") {
      this.retrieveParetoData();
      this.assetIdPareto = false;
      this.alarmReasonPareto = false;
      // if (this.assetIdPareto) {
      //   this.retrieveAssetIdParetoData(this.lastSelectedAssetType);
      // }
      // if (this.alarmReasonPareto) {
      //   this.retrieveAlarmReasonParetoData(this.lastSelectedAssetID);
      // }
    }
    
  }

  retrieveEODData() {
    //Send assets array and date(NgbDateStruct type), receive table data array\
    this.restService.postData("generateReportByType", this.authService.getToken(), {type: this.selectedReportType, date: this.date, assets: this.selectedAssets}).subscribe(data =>{
    // Success
        if (data["status"] == 200 && this.selectedAssets.length != 0) {
          this.eodTableData = data["data"]["rows"];
          this.eodTableKeys = [];
          for (let i = 0; i < this.selectedAssets.length; i++) {
            if(this.eodTableData[this.selectedAssets[i].name]) {
              this.eodTableKeys[i] = Object.keys(this.eodTableData[this.selectedAssets[i].name][0]);
              this.eodTableKeys[i].splice(this.eodTableKeys[i].indexOf("Timestamp"), 1);
              this.eodTableKeys[i].unshift("Timestamp");
            }
          }
        }
    });
  }

  retrieveParetoData() {
      //Send assets array and date(NgbDateStruct type), receive table data array\
      this.restService.postData("generateReportByType", this.authService.getToken(), {type: this.selectedReportType, subtype: "assettype", date: this.date}).subscribe(data =>{
      // Success
          if (data["status"] == 200) {
            this.generatePareto(data["data"]["rows"]["dataset_reason"]);
            this.paretoTableData = data["data"]["rows"]["dataset_reason"];
            this.dateRange = " / " + data["data"]["rows"]["dateRange"];
          }         
      });
  }

  retrieveAssetIdParetoData(assettype) {
    //Send assets array and date(NgbDateStruct type), receive table data array\
      this.restService.postData("generateReportByType", this.authService.getToken(), {type: this.selectedReportType, subtype: "assetid", assettype: assettype, date: this.date}).subscribe(data =>{
      // Success
          if (data["status"] == 200) {
            this.generateAssetIdPareto(data["data"]["rows"]["dataset_reason"]);
            this.assetIdParetoTableData = data["data"]["rows"]["dataset_reason"];
            this.assetTypeFilter = " / " + this.lastSelectedAssetType;
            this.dateRange = " / " + data["data"]["rows"]["dateRange"];
          }
      });
  }

  retrieveAlarmReasonParetoData(assetid_old) {
    // Extract asset ID (12345) from string - eg. 12345 (ASSET INFO)
    let assetid = assetid_old.split(' (', 1)[0];
    //Send assets array and date(NgbDateStruct type), receive table data array\
      this.restService.postData("generateReportByType", this.authService.getToken(), {type: this.selectedReportType, subtype: "alarmreason", assetid: assetid, date: this.date}).subscribe(data =>{
      // Success
          if (data["status"] == 200) {
            this.generateAlarmReasonPareto(data["data"]["rows"]["dataset_reason"]);
            this.alarmReasonParetoTableData = data["data"]["rows"]["dataset_reason"];
            this.assetIDFilter = " / " + this.lastSelectedAssetType + " / " + this.lastSelectedAssetID;
            this.dateRange = " / " + data["data"]["rows"]["dateRange"];
          }
      });
  }

  generatePareto(data){

        let chart = am4core.create("chartdiv", am4charts.XYChart);

        chart.data = data;
        chart.exporting.menu = new am4core.ExportMenu();

        let options = chart.exporting.getFormatOptions("pdf");
        options.addURL = false;
        options.imageFormat = "png";
        options.quality = 1;
        options.scale = 2;

        chart.exporting.setFormatOptions("pdf", options);
        chart.exporting.menu.items = [{
          "label": "...",
          "menu": [
            { "type": "pdf", "label": "PDF" },
            { "type": "print", "label": "Print" }
          ]
        }];

        // Create axes
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "reason";
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.labels.template.dx = -17;
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.renderer.labels.template.fontSize = 10;
        categoryAxis.renderer.labels.template.disabled = true;
        categoryAxis.tooltip.disabled = true;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minWidth = 50;
        valueAxis.min = 0;
        valueAxis.cursorTooltipEnabled = false;

        // Create series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "counter";
        series.dataFields.categoryX = "reason";
        series.interactionsEnabled = true;
        series.tooltipText = "{categoryX}: {valueY}";
        series.columns.template.strokeWidth = 0;

        series.tooltip.pointerOrientation = "vertical";

        series.columns.template.column.fillOpacity = 0.8;

        series.columns.template.adapter.add("fill", (fill, target)=>{
          return chart.colors.getIndex(target.dataItem.index);
        })

        series.columns.template.events.on("hit", function(ev) {
          this.assetIdPareto = true;
          this.retrieveAssetIdParetoData(ev.target.dataItem.categories["categoryX"]);
          this.lastSelectedAssetType = ev.target.dataItem.categories["categoryX"];
        }, this);


        let paretoValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        paretoValueAxis.renderer.opposite = true;
        paretoValueAxis.min = 0;
        paretoValueAxis.max = 100;
        paretoValueAxis.strictMinMax = true;
        paretoValueAxis.renderer.grid.template.disabled = true;
        paretoValueAxis.numberFormatter = new am4core.NumberFormatter();
        paretoValueAxis.numberFormatter.numberFormat = "#'%'"
        paretoValueAxis.cursorTooltipEnabled = false;

        let paretoSeries = chart.series.push(new am4charts.LineSeries())
        paretoSeries.dataFields.valueY = "counter_cumulative_percentage";
        paretoSeries.dataFields.categoryX = "reason";
        paretoSeries.yAxis = paretoValueAxis;
        paretoSeries.tooltipText = "{valueY.formatNumber('#.0')}%[/]";
        let circleBullet = paretoSeries.bullets.push(new am4charts.CircleBullet());
        circleBullet.circle.radius = 3;
        paretoSeries.strokeWidth = 1;

        chart.cursor = new am4charts.XYCursor();

        this.chart = chart;

  }

  generateAssetIdPareto(data){

        let chart = am4core.create("chartdiv2", am4charts.XYChart);

        chart.data = data;
        chart.exporting.menu = new am4core.ExportMenu();

        let options = chart.exporting.getFormatOptions("pdf");
        options.addURL = false;
        options.imageFormat = "png";
        options.quality = 1;
        options.scale = 2;

        chart.exporting.setFormatOptions("pdf", options);
        chart.exporting.menu.items = [{
          "label": "...",
          "menu": [
            { "type": "pdf", "label": "PDF" },
            { "type": "print", "label": "Print" }
          ]
        }];

        // Create axes
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "reason";
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.labels.template.dx = -17;
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.renderer.labels.template.fontSize = 10;
        categoryAxis.renderer.labels.template.disabled = true;
        categoryAxis.tooltip.disabled = true;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minWidth = 50;
        valueAxis.min = 0;
        valueAxis.cursorTooltipEnabled = false;

        // Create series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "counter";
        series.dataFields.categoryX = "reason";
        series.tooltipText = "{categoryX}: {valueY}";
        series.columns.template.strokeWidth = 0;

        series.tooltip.pointerOrientation = "vertical";

        series.columns.template.column.fillOpacity = 0.8;

        series.columns.template.adapter.add("fill", (fill, target)=>{
          return chart.colors.getIndex(target.dataItem.index);
        })

        series.columns.template.events.on("hit", function(ev) {
          this.alarmReasonPareto = true;
          this.retrieveAlarmReasonParetoData(ev.target.dataItem.categories["categoryX"]);
          this.lastSelectedAssetID = ev.target.dataItem.categories["categoryX"];
        }, this);

        let paretoValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        paretoValueAxis.renderer.opposite = true;
        paretoValueAxis.min = 0;
        paretoValueAxis.max = 100;
        paretoValueAxis.strictMinMax = true;
        paretoValueAxis.renderer.grid.template.disabled = true;
        paretoValueAxis.numberFormatter = new am4core.NumberFormatter();
        paretoValueAxis.numberFormatter.numberFormat = "#'%'"
        paretoValueAxis.cursorTooltipEnabled = false;

        let paretoSeries = chart.series.push(new am4charts.LineSeries())
        paretoSeries.dataFields.valueY = "counter_cumulative_percentage";
        paretoSeries.dataFields.categoryX = "reason";
        paretoSeries.yAxis = paretoValueAxis;
        paretoSeries.tooltipText = "{valueY.formatNumber('#.0')}%[/]";
        let circleBullet = paretoSeries.bullets.push(new am4charts.CircleBullet());
        circleBullet.circle.radius = 3;
        paretoSeries.strokeWidth = 1;

        chart.cursor = new am4charts.XYCursor();

        this.chart = chart;

  }

  generateAlarmReasonPareto(data){

      let chart = am4core.create("chartdiv3", am4charts.XYChart);

      chart.data = data;
      chart.exporting.menu = new am4core.ExportMenu();

      let options = chart.exporting.getFormatOptions("pdf");
      options.addURL = false;
      options.imageFormat = "png";
      options.quality = 1;
      options.scale = 2;

      chart.exporting.setFormatOptions("pdf", options);
      chart.exporting.menu.items = [{
        "label": "...",
        "menu": [
          { "type": "pdf", "label": "PDF" },
          { "type": "print", "label": "Print" }
        ]
      }];

      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "reason";
      categoryAxis.renderer.minGridDistance = 10;
      categoryAxis.renderer.labels.template.dx = -17;
      categoryAxis.renderer.labels.template.rotation = 270;
      categoryAxis.renderer.labels.template.fontSize = 10;
      categoryAxis.renderer.labels.template.disabled = true;
      categoryAxis.tooltip.disabled = true;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minWidth = 50;
      valueAxis.min = 0;
      valueAxis.cursorTooltipEnabled = false;

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.sequencedInterpolation = true;
      series.dataFields.valueY = "counter";
      series.dataFields.categoryX = "reason";
      series.tooltipText = "{categoryX}: {valueY}";
      series.columns.template.strokeWidth = 0;

      series.tooltip.pointerOrientation = "vertical";

      series.columns.template.column.fillOpacity = 0.8;

      series.columns.template.adapter.add("fill", (fill, target)=>{
        return chart.colors.getIndex(target.dataItem.index);
      })


      let paretoValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      paretoValueAxis.renderer.opposite = true;
      paretoValueAxis.min = 0;
      paretoValueAxis.max = 100;
      paretoValueAxis.strictMinMax = true;
      paretoValueAxis.renderer.grid.template.disabled = true;
      paretoValueAxis.numberFormatter = new am4core.NumberFormatter();
      paretoValueAxis.numberFormatter.numberFormat = "#'%'"
      paretoValueAxis.cursorTooltipEnabled = false;

      let paretoSeries = chart.series.push(new am4charts.LineSeries())
      paretoSeries.dataFields.valueY = "counter_cumulative_percentage";
      paretoSeries.dataFields.categoryX = "reason";
      paretoSeries.yAxis = paretoValueAxis;
      paretoSeries.tooltipText = "{valueY.formatNumber('#.0')}%[/]";
      let circleBullet = paretoSeries.bullets.push(new am4charts.CircleBullet());
      circleBullet.circle.radius = 3;
      paretoSeries.strokeWidth = 1;

      chart.cursor = new am4charts.XYCursor();

      this.chart = chart;

  }


  toggleTable(){
    this.paretoTableEnabled = !this.paretoTableEnabled;
  }
  toggleAssetIdTable(){
    this.assetIdParetoTableEnabled = !this.assetIdParetoTableEnabled;
  }
  toggleAlarmReasonTable(){
    this.alarmReasonParetoTableEnabled = !this.alarmReasonParetoTableEnabled;
  }


}
