import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { RestService } from '../rest.service';
import { AuthService } from '../auth.service';
import { MomentModule, FromUnixPipe, DateFormatPipe, SubtractPipe, AddPipe, ParsePipe } from 'angular2-moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  rows = [];
  alarmCount = {
  	raised_1hour: 0,
  	raised_24hour: 0,
  	cleared_1hour: 0,
  	cleared_24hour: 0
  }
  currentDate = new Date();

  // Function to convert DM occurred/cleared timestamp to epoch
  private DMTimeToEpoch (dmtime) {
    let inputdate = new ParsePipe().transform(dmtime, "HH:mm:ss DD/MM/YY");
    return new DateFormatPipe().transform(inputdate, 'X');
  }

  constructor(private appService: AppService, private restService: RestService, private authService: AuthService) {
    this.appService.pageTitle = 'Alarm Dashboard';
  }

  ngOnInit() {
  	// Get Alarms
    this.restService.postData("getAlarms", this.authService.getToken(), {period: "day"})
      .subscribe(data => {
        // Success
         if (data["status"] == 200) {
         	this.rows = data["data"].rows;
         	var current_epoch = (new Date).getTime() / 1000;
         	this.rows.forEach(function (element) {
         		if ((current_epoch - this.DMTimeToEpoch(element.occurred)) <= 3600) {
         			this.alarmCount.raised_1hour++;
         			if (element.cleared != "") {
         				this.alarmCount.cleared_1hour++;
         			}
         		}
         		if ((current_epoch - this.DMTimeToEpoch(element.occurred)) <= 86400) {
         			this.alarmCount.raised_24hour++;
         			if (element.cleared != "") {
         				this.alarmCount.cleared_24hour++;
         			}
         		}
         	}, this);
         }
      });
  }
}
