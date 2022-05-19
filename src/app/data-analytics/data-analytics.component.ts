import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-data-analytics',
  templateUrl: './data-analytics.component.html',
  styleUrls: ['./data-analytics.component.scss']
})
export class DataAnalyticsComponent implements OnInit {

  constructor(private appService: AppService) {
    this.appService.pageTitle = 'Data Analytics';
  }

  ngOnInit() {
  }

}
