import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-alarm-rules',
  templateUrl: './alarm-rules.component.html',
  styleUrls: ['./alarm-rules.component.scss']
})
export class AlarmRulesComponent implements OnInit {

  constructor(private appService: AppService) {
    this.appService.pageTitle = 'Rule Engine';
  }

  ngOnInit() {
  }

}
