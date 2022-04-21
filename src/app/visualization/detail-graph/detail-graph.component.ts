import { Component, OnInit, Input, Output, NgZone, EventEmitter, AfterViewInit } from '@angular/core';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { Config } from '../../../config/config';
import { ChangeDetectorRef } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-detail-graph',
  templateUrl: './detail-graph.component.html',
  styleUrls: ['./detail-graph.component.scss']
})
export class DetailGraphComponent implements AfterViewInit {
  @Input() row: any;
  @Output() valueChange = new EventEmitter();

  private chart: am4charts.XYChart;
  res: any[];
  chartTable: any;
  dateValue: any;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RestService, 
    private authService: AuthService, 
    private zone: NgZone,
    private config: Config, 
    private ref: ChangeDetectorRef
    ) {
      
     }

  async ngOnInit() {
    this.dateValue = new Date();
    var d = this.dateValue;
    var day = d.getDate();
    var month = d.getMonth()+1;
    if(month<10) {
      month = "0"+month;
    }
    var year = d.getFullYear();
    this.dateValue = year+"-"+month+"-"+day
    // Enable animations and theme
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_material);

    const epochNow = Math.round(Date.now() / 1000);
    this.row.timestamp = epochNow;
  }
 
  ngAfterViewInit() {
    setTimeout(()=>{
      this.generateDailyChart();
    },0); 
  }

  async generateDailyChart() {
    
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      var chart = am4core.create("chartdiv1", am4charts.XYChart);
      
      this.restService.postData("getControllerGraphDetail", this.authService.getToken(), this.row).subscribe(data => { 
        chart.data = data['data']['rows'];
        chart.data.forEach(function(item) {
          item.date *= 1000;
        });
        this.chartTable = [...chart.data];
        for(let i = 0; i < this.chartTable.length; i++) {
          var date = new Date(this.chartTable[i].date)
          this.chartTable[i].formattedDate = (date.toLocaleDateString('en-MY') +" "+date.toLocaleTimeString('en-MY'))
        }

      });

     
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.baseInterval = {"timeUnit": "minute", "count" : 15}; // Fixed 15 minute intervals
      dateAxis.gridIntervals.setAll([
        { timeUnit: "hour", count: 2 },
      ]);
			dateAxis.renderer.minGridDistance = 60;

      dateAxis.dateFormats.setKey("minute", "dd MMM hh:mm a");
      dateAxis.periodChangeDateFormats.setKey("minute", "dd MMM hh:mm a");
      dateAxis.minZoomCount = 1;


      // dateAxis.renderer.inside = true;
      dateAxis.renderer.axisFills.template.disabled = true;
      dateAxis.renderer.ticks.template.disabled = true;
      dateAxis.title.text = "Time";
      
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      if(this.row.units == this.config.UNITS_DEGREES_CELCIUS) {
        valueAxis.title.text = "Value " + this.config.SYMBOL_UNITS_DEGREES_CELCIUS; 
      }
      else {
        valueAxis.title.text = "Value " + this.row.units;
      }
      
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";
      series.tooltipText = "{valueY}";
      series.tooltip.pointerOrientation = "horizontal";
      series.stroke = am4core.color("#42cef5");
      series.fill = am4core.color("#42cef5")
      series.bullets.push(new am4charts.CircleBullet());

      
      /* Create a cursor */
      // this.chart.dateFormatter.utc = true;
      chart.dateFormatter.inputDateFormat = "x";
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;
      // this.chart.cursor.snapToSeries = series;
      chart.scrollbarX = new am4core.Scrollbar();
      chart.scrollbarX.parent = chart.bottomAxesContainer;
      
    });
  }

  async generateDailyDateChart() {
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      var chart = am4core.create("chartdiv1", am4charts.XYChart);
      
      this.restService.postData("getControllerGraphDetailDate", this.authService.getToken(), this.row).subscribe(data => { 
        chart.data = data['data']['rows'];
        chart.data.forEach(function(item) {
          item.date *= 1000;
        });
        this.chartTable = [...chart.data];
        for(let i = 0; i < this.chartTable.length; i++) {
          var date = new Date(this.chartTable[i].date)
          this.chartTable[i].formattedDate = (date.toLocaleDateString('en-MY') +" "+date.toLocaleTimeString('en-MY'))
        }

      });

     
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.baseInterval = {"timeUnit": "minute", "count" : 15}; // Fixed 15 minute intervals
      dateAxis.gridIntervals.setAll([
        { timeUnit: "hour", count: 2 },
      ]);
			dateAxis.renderer.minGridDistance = 60;

      dateAxis.dateFormats.setKey("minute", "dd MMM hh:mm a");
      dateAxis.periodChangeDateFormats.setKey("minute", "dd MMM hh:mm a");
      dateAxis.minZoomCount = 1;


      // dateAxis.renderer.inside = true;
      dateAxis.renderer.axisFills.template.disabled = true;
      dateAxis.renderer.ticks.template.disabled = true;
      dateAxis.title.text = "Time";
      
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      if(this.row.units == this.config.UNITS_DEGREES_CELCIUS) {
        valueAxis.title.text = "Value " + this.config.SYMBOL_UNITS_DEGREES_CELCIUS; 
      }
      else {
        valueAxis.title.text = "Value " + this.row.units;
      }
      
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";
      series.tooltipText = "{valueY}";
      series.tooltip.pointerOrientation = "horizontal";
      series.stroke = am4core.color("#42cef5");
      series.fill = am4core.color("#42cef5")
      series.bullets.push(new am4charts.CircleBullet());

      
      /* Create a cursor */
      // this.chart.dateFormatter.utc = true;
      chart.dateFormatter.inputDateFormat = "x";
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;
      // this.chart.cursor.snapToSeries = series;
      chart.scrollbarX = new am4core.Scrollbar();
      chart.scrollbarX.parent = chart.bottomAxesContainer;
      
    });
  }



  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('graph-table').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
        <title>${this.row.slave_description} - ${this.row.slave_name}</title>
        <style type="text/css">
          table th, table td { 
          border-style: groove;
        }
        </style>
      </head>
      <body onload="window.print();window.close()">${printContents}</body>
    </html>`
    );
    popupWin.document.close();
  }

  selectDateFn(event) {
    var changedDate = event.target.value;
    var epochDate = Date.parse(changedDate);
    console.log(epochDate);
    this.row.timestamp = (epochDate / 1000)-29700;
    this.generateDailyDateChart();
  } 

  closeModal() {
    this.activeModal.close();
  }

}

