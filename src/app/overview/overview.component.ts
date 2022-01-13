import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { RestService } from '../rest.service';
import { AuthService } from '../auth.service';
import { MomentModule, FromUnixPipe, DateFormatPipe, SubtractPipe, AddPipe, ParsePipe } from 'angular2-moment';
import { AlarmStatsComponent } from '../home/alarm-stats/alarm-stats.component';
import { WidgetAlarmCountersComponent } from './widget-alarm-counters/widget-alarm-counters.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  currentDate = new Date();
  currentPage = 1;
  overviewData;

  constructor(public appService: AppService, private restService: RestService, private authService: AuthService) {
    this.appService.pageTitle = 'Home';
  }

  ngOnInit() {
  }

  togglePage() {
  	if (this.currentPage == 1) {
  		this.currentPage = 2;
  	} else {
  		this.currentPage = 1;
  	}
  }

  getOverviewData() {
    this.restService.postData("generateOverviewData", this.authService.getToken())
    .subscribe(data => {
      // Successful login
      if (data["status"] == 200) {
        this.overviewData = data["data"].rows;
        //console.log(this.overviewData);
      }
    });
  }
}
