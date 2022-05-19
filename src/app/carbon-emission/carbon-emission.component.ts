import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-carbon-emission',
  templateUrl: './carbon-emission.component.html',
  styleUrls: ['./carbon-emission.component.scss']
})
export class CarbonEmissionComponent implements OnInit {

  constructor(private appService: AppService) {
    this.appService.pageTitle = 'Carbon Emission';
  }

  ngOnInit() {
  }

}
