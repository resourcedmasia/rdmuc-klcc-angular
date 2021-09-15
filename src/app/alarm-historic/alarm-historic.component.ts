import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-alarm-historic',
  templateUrl: './alarm-historic.component.html',
  styleUrls: ['./alarm-historic.component.scss']
})
export class AlarmHistoricComponent implements OnInit {

  constructor(private appService: AppService) {
    this.appService.pageTitle = 'Historic Alarms';
  }

  ngOnInit() {
  }

}
