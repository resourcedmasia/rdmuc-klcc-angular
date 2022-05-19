import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { NgbDate, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'energy-usage-summary',
  templateUrl: './energy-usage-summary.component.html',
  styleUrls: ['./energy-usage-summary.component.scss',
  '../../../vendor/libs/ngb-datepicker/ngb-datepicker.scss']
})
export class EnergyUsageSummaryComponent implements OnInit, OnDestroy {

	minDateStart:NgbDateStruct;
 	maxDateStart:NgbDateStruct;
	minDateEnd:NgbDateStruct;
 	maxDateEnd:NgbDateStruct;
	dateStart:NgbDateStruct;
	dateEnd:NgbDateStruct;

	endDateDisabled:boolean = true;
	energyUsageChart:boolean = false;


	periods = [{"label":"Day", "value":"day"}, {"label":"Week", "value":"week"}, {"label":"Month", "value":"month"}];
	selectedPeriod;

	private chart: am4charts.XYChart;
	private chart2: am4charts.XYChart;
	private chart3: am4charts.XYChart;

	constructor(private restService: RestService, private authService: AuthService, private zone: NgZone) {}

	onStartDateSelect(date: NgbDate) {
		//Set min end date to be at least same day as start date
		this.minDateEnd = date;
		//Set start date
		this.dateStart = date;
		//If start date is after the current selected end date, set end date to be same as start date (prevent end date value earlier than start date)
		if (date.after(this.dateEnd)) {
			this.dateEnd = this.dateStart;
		}
		this.endDateDisabled = false;
		this.retrieveEnergyUsageData();
	}

	onEndDateSelect(date: NgbDate) {
		this.dateEnd = date;
		this.retrieveEnergyUsageData();
	}

	onPeriodChange(event){
		console.log(event);
		this.selectedPeriod = event;
		this.retrieveEnergyUsageData();
	}

	retrieveEnergyUsageData(){
		if (this.dateStart && this.dateEnd && this.selectedPeriod) {

			this.energyUsageChart = true;

		    //Send assets array and date(NgbDateStruct type), receive table data array\
		    this.restService.postData("getEnergyUsageSummary", this.authService.getToken(), {startdate: this.dateStart, enddate: this.dateEnd, period: this.selectedPeriod.value}).subscribe(data =>{
		    // Success
		        if (data["status"] == 200) {
		        	this.generateEnergyUsageChartByAssetType(data["data"]["rows"]["assettype_kwhsummary"]);
		        	this.generateEnergyUsageChartByAssetName(data["data"]["rows"]["assetname_kwhsummary"]);
		        	this.generateEnergyUsageChartByControllerID(data["data"]["rows"]["controllername_kwhsummary"]);
		        }
		    });
		}
	}

	generateEnergyUsageChartByAssetType(data){
		this.zone.runOutsideAngular(() => {

			this.zone.runOutsideAngular(() => {
				if (this.chart) {
					this.chart.dispose();
				}
			});

			// Create chart instance
			let chart = am4core.create("chartdiv", am4charts.XYChart);


			// Add data
			chart.data = data;

			// Create axes
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "timestamp";
			categoryAxis.renderer.grid.template.location = 0;


			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;

			// Create series
			function createSeries(name) {
			  
			  // Set up series
			  let series = chart.series.push(new am4charts.ColumnSeries());
			  series.name = name;
			  series.dataFields.valueY = name;
			  series.dataFields.categoryX = "timestamp";
			  series.sequencedInterpolation = false;
			  
			  series.stacked = true;
			  
			  // Configure columns
			  series.columns.template.width = am4core.percent(60);
			  series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
			  
			  // // Add label
			  // let labelBullet = series.bullets.push(new am4charts.LabelBullet());
			  // labelBullet.label.text = "{valueY}";
			  // labelBullet.locationY = 0.5;
			  
			  return series;
			}

			//Iterate through each key to get asset name and create a new series for it
			for (let i = 0; i < (Object.keys(chart.data[0])).length; i++) {
				//Ignore 'timestamp' key
				if(Object.keys(chart.data[0])[i] != "timestamp") {
					createSeries(Object.keys(chart.data[0])[i]);
				}
			}

			// Legend
			chart.legend = new am4charts.Legend();

			this.chart = chart;

		});
		
	}

	generateEnergyUsageChartByAssetName(data){
		this.zone.runOutsideAngular(() => {

			this.zone.runOutsideAngular(() => {
				if (this.chart2) {
					this.chart2.dispose();
				}
			});

			// Create chart instance
			let chart = am4core.create("chartdiv2", am4charts.XYChart);


			// Add data
			chart.data = data;

			// Create axes
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "timestamp";
			categoryAxis.renderer.grid.template.location = 0;


			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;

			// Create series
			function createSeries(name) {
			  
			  // Set up series
			  let series = chart.series.push(new am4charts.ColumnSeries());
			  series.name = name;
			  series.dataFields.valueY = name;
			  series.dataFields.categoryX = "timestamp";
			  series.sequencedInterpolation = false;
			  
			  series.stacked = true;
			  
			  // Configure columns
			  series.columns.template.width = am4core.percent(60);
			  series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
			  
			  // // Add label
			  // let labelBullet = series.bullets.push(new am4charts.LabelBullet());
			  // labelBullet.label.text = "{valueY}";
			  // labelBullet.locationY = 0.5;
			  
			  return series;
			}

			//Iterate through each key to get asset name and create a new series for it
			for (let i = 0; i < (Object.keys(chart.data[0])).length; i++) {
				//Ignore 'timestamp' key
				if(Object.keys(chart.data[0])[i] != "timestamp") {
					createSeries(Object.keys(chart.data[0])[i]);
				}
			}

			// Legend
			chart.legend = new am4charts.Legend();

			this.chart2 = chart;

		});
		
	}

	generateEnergyUsageChartByControllerID(data){

		this.zone.runOutsideAngular(() => {

			this.zone.runOutsideAngular(() => {
				if (this.chart3) {
					this.chart3.dispose();
				}
			});

			// Create chart instance
			let chart = am4core.create("chartdiv3", am4charts.XYChart);


			// Add data
			chart.data = data;

			// Create axes
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "timestamp";
			categoryAxis.renderer.grid.template.location = 0;


			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.min = 0;

			// Create series
			function createSeries(name) {
			  
			  // Set up series
			  let series = chart.series.push(new am4charts.ColumnSeries());
			  series.name = name;
			  series.dataFields.valueY = name;
			  series.dataFields.categoryX = "timestamp";
			  series.sequencedInterpolation = false;
			  
			  series.stacked = true;
			  
			  // Configure columns
			  series.columns.template.width = am4core.percent(60);
			  series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
			  
			  // // Add label
			  // let labelBullet = series.bullets.push(new am4charts.LabelBullet());
			  // labelBullet.label.text = "{valueY}";
			  // labelBullet.locationY = 0.5;
			  
			  return series;
			}

			//Iterate through each key to get asset name and create a new series for it
			for (let i = 0; i < (Object.keys(chart.data[0])).length; i++) {
				//Ignore 'timestamp' key
				if(Object.keys(chart.data[0])[i] != "timestamp") {
					createSeries(Object.keys(chart.data[0])[i]);
				}
			}

			// Legend
			chart.legend = new am4charts.Legend();

			this.chart3 = chart;

		});

	}

	ngOnInit() {
	    //Set amcharts theme
    	am4core.useTheme(am4themes_animated);

    	this.selectedPeriod = this.periods[0];


    	//Load initial date min max
  		this.restService.postData("getEnergyMinMaxDate", this.authService.getToken()).subscribe(data =>{
			// Success
        	if (data["status"] == 200) {
       	  		//Populate min/max date range
          		this.minDateStart = data["data"]["rows"]["minDate"];
          		this.maxDateStart = data["data"]["rows"]["maxDate"];
          		this.minDateEnd = data["data"]["rows"]["minDate"];
          		this.maxDateEnd = data["data"]["rows"]["maxDate"];
        	}
		});
	}

	ngOnDestroy() {
		this.zone.runOutsideAngular(() => {
			if (this.chart) {
				this.chart.dispose();
			}
		});
	}

}
