import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-report-generation',
  templateUrl: './report-generation.component.html',
  styleUrls: ['./report-generation.component.scss']
})
export class ReportGenerationComponent implements OnInit {

  constructor(private appService: AppService) {
    this.appService.pageTitle = 'Report Generation';
  }

  ngOnInit() {
  }

}
