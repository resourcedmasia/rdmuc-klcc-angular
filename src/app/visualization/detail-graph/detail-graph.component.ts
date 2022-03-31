import { Component, OnInit, Input, Output, NgZone, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { Config } from '../../../config/config';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";

@Component({
  selector: 'app-detail-graph',
  templateUrl: './detail-graph.component.html',
  styleUrls: ['./detail-graph.component.scss']
})
export class DetailGraphComponent implements OnInit {
  @Input() row: any;
  @Output() valueChange = new EventEmitter();

  private chart: am4charts.XYChart;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RestService, 
    private authService: AuthService, 
    private zone: NgZone,
    private config: Config, 
    ) {
      
     }

  async ngOnInit() {
    // Enable animations and theme
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_material);

    // Create chart instance
    this.chart = am4core.create("chartdiv1", am4charts.XYChart);
    const epochNow = Math.round(Date.now() / 1000);
    this.row.timestamp = epochNow;
    console.log("ROW",this.row);
          
    // Add data
    this.restService.postData("getControllerGraphDetail", this.authService.getToken(), this.row).subscribe(data => { 
      this.chart.data = data['data']['rows'];
    });


    setTimeout(()=>{
      this.generateDailyChart()
    },0);
    
  }

  async generateDailyChart() {
    
    
    this.zone.runOutsideAngular(() => {

      this.chart.dateFormatter.utc = true;
      
      var dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.minZoomCount = 1;
      // dateAxis.gridIntervals.setAll([{ timeUnit: "hour", count: 1 }]);
      dateAxis.title.text = "Time";
      dateAxis.renderer.minGridDistance = 60;
      
      var valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
      if(this.row.units == this.config.UNITS_DEGREES_CELCIUS) {
        valueAxis.title.text = "Value " + this.config.SYMBOL_UNITS_DEGREES_CELCIUS; 
      }
      else {
        valueAxis.title.text = "Value " + this.row.units;
      }
      
      var series = this.chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";
      series.tooltipText = "{valueY}";
      series.tooltip.pointerOrientation = "vertical";
      series.stroke = am4core.color("#42cef5");
      series.fill = am4core.color("#42cef5")
      series.bullets.push(new am4charts.CircleBullet());

      
      /* Create a cursor */
      this.chart.cursor = new am4charts.XYCursor();
      this.chart.cursor.xAxis = dateAxis;
      this.chart.cursor.snapToSeries = series;
      this.chart.scrollbarX = new am4core.Scrollbar();
      this.chart.scrollbarX.parent = this.chart.bottomAxesContainer;
      
    });
  }

  closeModal() {
    this.activeModal.close();
  }

}
