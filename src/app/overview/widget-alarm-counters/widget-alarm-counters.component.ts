import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'widget-alarm-counters',
  templateUrl: './widget-alarm-counters.component.html',
  styleUrls: ['./widget-alarm-counters.component.scss']
})
export class WidgetAlarmCountersComponent implements OnInit {

  alarmCounters;

  constructor(private appService: AppService, private restService: RestService, private authService: AuthService) {
  }

  ngOnInit() {
  	this.getAlarmCount();
  }

  getAlarmCount() {
	this.restService.postData("getAlarmCount", this.authService.getToken())
    .subscribe(data => {
      // Successful login
      if (data["status"] == 200) {
        this.alarmCounters = data["data"].rows;
      }
    });
  }
}
