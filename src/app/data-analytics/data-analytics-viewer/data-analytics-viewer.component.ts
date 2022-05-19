import { Component, OnInit, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { MomentModule, FromUnixPipe, DateFormatPipe } from 'angular2-moment';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { NouisliderComponent } from 'ng2-nouislider';
import { Router } from '@angular/router';

@Component({
  selector: 'data-analytics-viewer',
  templateUrl: './data-analytics-viewer.component.html',
  styleUrls: [
  	'./data-analytics-viewer.component.scss',
  	'../../../vendor/libs/ng2-nouislider/ng2-nouislider.scss',
  ]
})
export class DataAnalyticsViewerComponent implements OnInit, OnDestroy {
	@ViewChild('dateRangeSlider') public dateRangeSlider: NouisliderComponent

	dateSliderConfig = {
		connect: true,
		behaviour: 'tap-drag',
		step: 86400,
		tooltips: true,
		range: {
			'min': new Date('2018').getTime()/1000,
			'max': new Date('2020').getTime()/1000
		},
		// Placeholder date
		start: [
			new Date('2018').getTime()/1000,
			new Date('2019').getTime()/1000
		],
		// https://refreshless.com/nouislider/number-formatting/
		format: {
		  // 'to' the formatted value. Receives a number.
		  // Convert epoch time to human readable timestamp
	      to: function ( value: number ) {
	      	let formattedDate = new DateFormatPipe().transform(new FromUnixPipe().transform(value), 'DD MMMM YYYY'); // LL, LLLL
			return formattedDate.toString();
	      },
	      // 'from' the formatted value.
	      // Receives a string, should return a number.
	      // Convert human readable timestamp back to epoch time
	      from: function ( value ) {
			return value;
	      }
	    }
	};

	currentDateRange;
	currentAsset:string;
	currentController:Array<string>;
	currentKeys:Array<object> = [];

	assetList:Array<string>;
	assetListShow:boolean = true;

	controllerListEnabled:boolean = false;
	controllerListShow:boolean = true;
	controllerList:Array<string>;

	keyListEnabled:boolean = false;
	keyListShow:boolean = true;
	keyList:Array<string>;

	chartEnabled:boolean = false;

	private chart: am4charts.XYChart;
  
  constructor(private restService: RestService, private authService: AuthService, private zone: NgZone, private router: Router) { }

  ngOnInit() {

  	am4core.useTheme(am4themes_animated);

  	//Perform POST request on init to retrieve initial date range
	this.restService.postData("getAnalyticsMinMaxDate", this.authService.getToken()).subscribe(data => {
	    // Success
	    if (data["status"] == 200) {
	    	// Set min/max date range
	    	let newOptions = {
	    		range: {
	    			'min': data["data"].rows.mindate,
	    			'max': data["data"].rows.maxdate
	    		},
	    		start: [
	    			data["data"].rows.maxdate - (86400 * 7),
	    			data["data"].rows.maxdate
	    		]
	    	}
	    	this.dateRangeSlider.slider.updateOptions(newOptions);

	    	// Set initial selection date range
	    	this.currentDateRange = this.dateRangeSlider.slider.get("start");
	    }
	});

	//Perform POST request to retrieve 'Assets'
	this.restService.postData("getAnalyticsAssetList", this.authService.getToken()).subscribe(data => {
	    // Success
	    if (data["status"] == 200) {
	    	this.assetList = data["data"].rows;
	    }
	});
	
  }

  dateChange(dateRange){
  	//Set currentDateRange to selected dates
  	this.currentDateRange = dateRange;

  	//If chart exists, retrieve new chart data with date
  	if (this.chart) {
  		this.retrieveChartData(this.currentDateRange, this.currentKeys);
  	}

  }

  onAssetSelection(asset) {

  	this.controllerListShow = true;

  	//Set currentAsset to selected asset
  	this.currentAsset = asset.name + " (" + asset.additional_info + ")";

  	//Show controller selection panel
  	this.controllerListEnabled = true;
  	//Clear controller list to prevent user from clicking previous list when new list is loading
  	this.controllerList = [];
  	this.keyListEnabled = false;

	//Perform POST request to retrieve 'Controllers'
	this.restService.postData("getAnalyticsControllerList", this.authService.getToken(), {asset_id: asset.id}).subscribe(data => {
	    // Success
	    if (data["status"] == 200) {
	    	this.controllerList = data["data"].rows;
	    }
	});

  }

  onControllerSelection(controller) {

  	//Hide asset list
  	this.assetListShow = false;

  	//Set currentController to selected controller
  	this.currentController = controller;

  	//Show key selection panel
  	this.keyListEnabled = true;
  	//Clear key list to prevent user from clicking previous list when new list is loading
  	this.keyList = [];

  	//Perform POST request to retrieve 'Keys'
	this.restService.postData("getAnalyticsKeyList", this.authService.getToken(), {controller: controller}).subscribe(data => {
	    // Success
	    if (data["status"] == 200) {
	    	this.keyList = data["data"].rows;

	    	//Build controller + key pair array
	    	let currentControllerKeyList = []

	    	for (let i = 0; i < this.keyList.length; i++) {
	    		currentControllerKeyList.push(this.currentController+this.keyList[i]);
	    	}

	    	//Check if selected controllerKey pair exist in the array, if yes, check relevant checkboxes
	    	setTimeout(() =>{
	    		for (let i = 0; i < this.currentKeys.length; i++) {
		    		if (currentControllerKeyList.includes(this.currentKeys[i]['id'])) {
		    			document.getElementById(this.currentKeys[i]['id']).setAttribute("checked", "true");

		    		}
		    	}
	    	});
	    	

	    }
	});

	//Placeholder random string array generating script (replace with post return data)
	//this.keyList = [Math.random().toString(36).substr(2, 5), Math.random().toString(36).substr(2, 5), Math.random().toString(36).substr(2, 5),Math.random().toString(36).substr(2, 5), Math.random().toString(36).substr(2, 5), Math.random().toString(36).substr(2, 5),Math.random().toString(36).substr(2, 5), Math.random().toString(36).substr(2, 5), Math.random().toString(36).substr(2, 5)];


  }

  onKeySelection(controllerKeyPair) {

  	//Hide controller list
  	this.controllerListShow = false;

  	//If key already selected, toggle it off and remove from array (stupid check not working for some reason)
  	if (this.currentKeys.some(item => item['id'] === controllerKeyPair.id)) {
  		// Get index of object with same id as controllerKeyPair id
		let removeIndex = this.currentKeys.map(function(item) { return item['id']; }).indexOf(controllerKeyPair.id);
		// Remove object
		this.currentKeys.splice(removeIndex, 1);
  	} else {
  		this.currentKeys.push(controllerKeyPair); //Else add it to array
  	}

	this.retrieveChartData(this.currentDateRange, this.currentKeys);	
  	
  }


  retrieveChartData(date, controllerKeyData){
  	// console.log(date);
  	// console.log(controllerKeyData);

  	this.restService.postData("getAnalyticsDataset", this.authService.getToken(), {date: date, controllerkeys: controllerKeyData}).subscribe(data => {
	    // Success
	    if (data["status"] == 200) {
	    	//Generate chart
  			this.populateChart(data["data"].rows);
	    }
	});

  }


	populateChart(data) {

		//Show chart
  		this.chartEnabled = true;

		setTimeout(() =>{

			this.zone.runOutsideAngular(() => {
				// Dispose chart if exists
				if (this.chart) {
					this.chart.dispose();
				}

				// Dataset array length is 0 (no data), do not proceed
				if (data.length == 0) {
					return;
				}
			
				this.chart = am4core.create("chartdiv", am4charts.XYChart);

				this.chart.data = data[0]["data"];

				// Create axes
				let dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
				//dateAxis.dateFormats.setKey("day", "x");
				dateAxis.baseInterval = {"timeUnit": "minute", "count" : 15}; // Fixed 15 minute intervals
				dateAxis.renderer.minGridDistance = 60;

				let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

				this.addSeries(data);

				this.chart.cursor = new am4charts.XYCursor();
				this.chart.cursor.xAxis = dateAxis;

				this.chart.legend = new am4charts.Legend();
				this.chart.legend.useDefaultMarker = true;

		});

		});
	
	}


	addSeries(data) {
	 	for (let i = 0; i < this.chart.data.length; i++) {
	 		// Do not exceed array bounds
	 		if (!data[i]) {
	 			continue;
	 		}
	 		// console.log(data);
	 		let series = this.chart.series.push(new am4charts.LineSeries());
	 		series.dataFields.valueY = "value";
	  		series.dataFields.dateX = "date";
	  		series.dateFormatter.dateFormat = "yyyy-MM-dd HH:mm";
	  		series.data = data[i]["data"];
	  		series.name = data[i]["controllerkey"];
	  		series.strokeWidth = 1; // Set stroke width
	  		series.tensionX = 0.7;
	  		series.fillOpacity = 0.2;
	  		series.stacked = false; // Don't stack series
	  		series.tooltipText = "Series: {name}\nTime: {dateX}\nValue: {valueY}";
	 	}
	 	this.chart.invalidateData();
	}



	ngOnDestroy() {
		this.zone.runOutsideAngular(() => {
		  if (this.chart) {
		    this.chart.dispose();
		  }
		});
	}

	toggleAssets(){
		this.assetListShow = !this.assetListShow;
	}
	toggleControllers(){
		this.controllerListShow = !this.controllerListShow;
	}
	toggleKeys(){
		this.keyListShow = !this.keyListShow;
	}

	clearAll(){
		location.reload();
	}

}
