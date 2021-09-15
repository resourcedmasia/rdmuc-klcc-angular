import { Component, ViewChildren, QueryList, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { LayoutService } from '../../layout/layout.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { MomentModule, FromUnixPipe, DateFormatPipe, SubtractPipe, AddPipe, ParsePipe } from 'angular2-moment';

@Component({
  selector: 'alarm-stats',
  templateUrl: './alarm-stats.component.html',
  styleUrls: ['./alarm-stats.component.scss']
})
export class AlarmStatsComponent implements OnInit {
	rows = [];
  alarmCount = {
  	raised_1hour: 0,
  	raised_24hour: 0,
  	cleared_1hour: 0,
  	cleared_24hour: 0,
  	percentage: 0,
  	percentage_inverse: 0
  }

  // Chart 1
  chart1Labels = [];
  chart1Data = [{
    label: 'Raised',
    data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    borderWidth: 1,
    fill: false
  }, {
    label: 'Cleared',
    data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    borderWidth: 1,
    borderDash: [5, 5]
  }];
  chart1Options = {
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          fontColor: '#aaa',
          autoSkipPadding: 50
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          fontColor: '#aaa',
          maxTicksLimit: 5
        }
      }]
    },

    responsive: false,
    maintainAspectRatio: false
  };
  chart1Colors = [{
    backgroundColor: 'rgba(217, 83, 79, 0.1)',
    borderColor: '#d9534f'
  }, {
    backgroundColor: 'rgba(2, 188, 119, 0.1)',
    borderColor: '#02bc77'
  }];


  chart3Data = [{
    data: [0, 100],
    borderWidth: 0
  }];
  chart3Options = {
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    cutoutPercentage: 94,
    responsive: false,
    maintainAspectRatio: false
  };
  chart3Colors = [{
    backgroundColor: ['#02BC77', '#f9f9f9'],
    hoverBackgroundColor: ['#02BC77', '#f9f9f9']
  }];
  constructor(private restService: RestService, private authService: AuthService, private appService: AppService, private layoutService: LayoutService) { }

  // Function to check if value is between min and max range
  private inRange(value, min, max) {
    return ((value-min)*(value-max) <= 0);
  }

  // Function to convert DM occurred/cleared timestamp to epoch
  private DMTimeToEpoch (dmtime) {
    let inputdate = new ParsePipe().transform(dmtime, "HH:mm:ss DD/MM/YY");
    return new DateFormatPipe().transform(inputdate, 'X');
  }

  ngOnInit() {
    // Reset alarm counts
  	this.alarmCount = {
  		raised_1hour: 0,
  		raised_24hour: 0,
  		cleared_1hour: 0,
  		cleared_24hour: 0,
  		percentage: 0,
  		percentage_inverse: 0,
  	}

  	// Get Alarms
    this.restService.postData("getAlarms", this.authService.getToken(), {period: "day"})
      .subscribe(data => {
        // Success
         if (data["status"] == 200) {
         	this.rows = data["data"].rows;
         	let current_epoch = (new Date).getTime() / 1000;
         	this.rows.forEach(function (element) {
         		if ((current_epoch - this.DMTimeToEpoch(element.occurred)) <= 86400) {
         			this.alarmCount.raised_24hour++;
         			if (element.cleared != "") {
         				this.alarmCount.cleared_24hour++;
         			}
         		}
         	}, this);
         	// Calculate and set percentage
         	this.alarmCount.percentage = Math.floor((this.alarmCount.cleared_24hour / this.alarmCount.raised_24hour) * 100);
         	this.alarmCount.percentage_inverse = Math.floor(100 - this.alarmCount.percentage);
         	this.chart3Data = [{
    			data: [this.alarmCount.percentage, this.alarmCount.percentage_inverse],
    			borderWidth: 0
  			}];

          // Chart1 Data
          // Get current hour to past 24 hours
          let hours = [];
          let current_date = new Date();
          let current_date_epoch = new DateFormatPipe().transform(current_date, 'X');
          let current_date_epoch_nearesthour = parseInt(current_date_epoch) - (parseInt(current_date_epoch) % 3600);
          for(let count = 0; count < 24; count++) {
            let hours_raised_count = 0;
            let hours_cleared_count = 0;
            // Get hour labels
            hours.push(new DateFormatPipe().transform((new SubtractPipe().transform(current_date, count, 'hours')), 'h:00 A'));
            // Get hourly start/stop to calculate values
            let starttime = current_date_epoch_nearesthour - (3600 * count);
            let stoptime = current_date_epoch_nearesthour - (3600 * (count+1));
            this.rows.forEach(function (element) {
               if (this.inRange(this.DMTimeToEpoch(element.occurred), starttime, stoptime)) {
                 hours_raised_count++;
                 if (element.cleared != "") {
                   hours_cleared_count++;
                 }
               }
            }, this);
            this.chart1Data[0].data.push(hours_raised_count);
            this.chart1Data[1].data.push(hours_cleared_count);
          }
          // Reverse arrays
          hours.reverse();
          this.chart1Data[0].data.reverse();
          this.chart1Data[1].data.reverse();
          this.chart1Labels = hours;
         }

         setTimeout(() => {
          const resizeCharts = () => this.charts.forEach(chart => chart.chart.resize());
          // Initial resize
          resizeCharts();
          // For performance reasons resize charts on delayed resize event
          this.layoutService.on('resize.alarm-stats', resizeCharts);
         });

      });
  }

  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;
  ngAfterViewInit() {
    setTimeout(() => {
      const resizeCharts = () => this.charts.forEach(chart => chart.chart.resize());

      // Initial resize
      resizeCharts();

      // For performance reasons resize charts on delayed resize event
      this.layoutService.on('resize.alarm-stats', resizeCharts);
    });
  }
}
