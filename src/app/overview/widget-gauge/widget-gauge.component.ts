import { Component, AfterViewInit, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AppService } from '../../app.service';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'widget-gauge',
  templateUrl: './widget-gauge.component.html',
  styleUrls: ['./widget-gauge.component.scss']
})
export class WidgetGaugeComponent implements OnInit, OnDestroy {
  @Input() name: any;
  @Input() label: any;
  @Input() value: any;
  @Input() maxvalue: any;
  @Input() color: any;
  @Input() cid: any;
  @Input() clickroute: any;

  private chart: am4charts.GaugeChart;

  constructor(private router: Router, private appService: AppService, private restService: RestService, private authService: AuthService) {
  }

  ngOnInit() {

  }
  
  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
  
  ngAfterViewInit() {
    this.drawChart();
  }

  drawChart() {
  	// Enable animations and theme
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    this.chart = am4core.create(this.cid, am4charts.GaugeChart);
    this.chart.innerRadius = am4core.percent(80);

    // Create axes
    /*
    let axis = this.chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
	  axis.min = 0;
	  axis.max = 100;
	  axis.strictMinMax = true;
	  axis.renderer.radius = am4core.percent(80);
	  axis.renderer.inside = true;
	  axis.renderer.line.strokeOpacity = 1;
	  axis.renderer.ticks.template.disabled = false
	  axis.renderer.ticks.template.strokeOpacity = 1;
	  axis.renderer.ticks.template.length = 10;
	  axis.renderer.grid.template.disabled = true;
	  axis.renderer.labels.template.radius = 40;
	  axis.renderer.labels.template.adapter.add("text", function(text) {
  		return text + "%";
	  })
    */

    let colorSet = new am4core.ColorSet();

    let axis2 = this.chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis2.min = 0;
    axis2.max = 100;
    axis2.renderer.innerRadius = 10
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = true;

    let range0 = axis2.axisRanges.create();
    range0.value = 0;
    range0.endValue = 50;
    range0.axisFill.fillOpacity = 1;
    range0.axisFill.fill = am4core.color(this.color);

    let range1 = axis2.axisRanges.create();
    range1.value = 50;
    range1.endValue = 100;
    range1.axisFill.fillOpacity = 0.1;
    range1.axisFill.fill = am4core.color("black");


    let label = this.chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 15;
    label.x = am4core.percent(50);
    label.y = am4core.percent(100);
    label.horizontalCenter = "middle";
    label.verticalCenter = "bottom";
    label.text = this.label;


    var hand = this.chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(80);
    hand.startWidth = 1;
    hand.pin.disabled = true;
    hand.value = this.value / this.maxvalue * 100;

    hand.events.on("propertychanged", function(ev) {
      range0.endValue = ev.target.value;
      range1.value = ev.target.value;
      axis2.invalidate();
    });
  }

  clicked() {
    if (this.clickroute) {
      this.router.navigate([this.clickroute]);
    }
    
  }
}
