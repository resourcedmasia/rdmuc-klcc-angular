import { Component, AfterViewInit, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AppService } from '../../app.service';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'widget-heatmap',
  templateUrl: './widget-heatmap.component.html',
  styleUrls: ['./widget-heatmap.component.scss']
})
export class WidgetHeatmapComponent implements OnInit, OnDestroy {
  @Input() name: any;
  @Input() cid: any;
  @Input() values: any;

  private chart: am4charts.XYChart;

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
    this.chart = am4core.create(this.cid, am4charts.XYChart);
    this.chart.maskBullets = false;

    let xAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
	  let yAxis = this.chart.yAxes.push(new am4charts.CategoryAxis());

    xAxis.dataFields.category = "weekday";
	  yAxis.dataFields.category = "hour";

	  xAxis.renderer.grid.template.disabled = true;
	  xAxis.renderer.minGridDistance = 40;
	  xAxis.renderer.labels.template.fontSize = 10;

	  yAxis.renderer.grid.template.disabled = true;
	  yAxis.renderer.inversed = true;
	  yAxis.renderer.minGridDistance = 30;
	  yAxis.renderer.labels.template.fontSize = 10;

	  let series = this.chart.series.push(new am4charts.ColumnSeries());
	  series.dataFields.categoryX = "weekday";
	  series.dataFields.categoryY = "hour";
	  series.dataFields.value = "value";
	  series.sequencedInterpolation = true;
	  series.defaultState.transitionDuration = 3000;

	  let bgColor = new am4core.InterfaceColorSet().getFor("background");

	  let columnTemplate = series.columns.template;
	  columnTemplate.strokeWidth = 1;
	  columnTemplate.strokeOpacity = 0.2;
	  columnTemplate.stroke = bgColor;
	  columnTemplate.tooltipText = "{weekday}, {hour}: {value.workingValue.formatNumber('#.')} kWh";
	  columnTemplate.width = am4core.percent(100);
	  columnTemplate.height = am4core.percent(100);

	  series.heatRules.push({
  		target: columnTemplate,
  		property: "fill",
  		min: am4core.color("#fff"),
  		max: am4core.color("#3182bd"),
	  });

	  // heat legend
	  let heatLegend = this.chart.bottomAxesContainer.createChild(am4charts.HeatLegend);
	  heatLegend.width = am4core.percent(100);
	  heatLegend.series = series;
	  heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
	  heatLegend.valueAxis.renderer.minGridDistance = 30;

	  // heat legend behavior
	  series.columns.template.events.on("over", function(event) {
		  handleHover(event.target);
	  })

	  series.columns.template.events.on("hit", function(event) {
		  handleHover(event.target);
	  })

	  function handleHover(column) {
  		if (!isNaN(column.dataItem.value)) {
    		heatLegend.valueAxis.showTooltipAt(column.dataItem.value)
  		}
  		else {
    		heatLegend.valueAxis.hideTooltip();
  		}
	  }

	  series.columns.template.events.on("out", function(event) {
  		heatLegend.valueAxis.hideTooltip();
	  })

	  this.chart.data = this.values;
  }
}
