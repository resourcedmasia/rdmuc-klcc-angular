import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'table-pending-submission',
  templateUrl: './table-pending-submission.component.html',
  styleUrls: ['./table-pending-submission.component.scss']
})
export class TablePendingSubmissionComponent implements OnInit {

  loadingIndicator = true;
  rows = [];
  columns = [{
    prop: 'semesterName',
    name: '×¡×ž×¡×˜×¨',
    resizeable: false
 }];

  constructor(private appService: AppService, private restService: RestService, private authService: AuthService) {
  }

  ngOnInit() {
    this.getFacilityReportsByYear();
  }

  getFacilityReportsByYear() {
    this.restService.postData("getFacilityReportsByYear", this.authService.getToken(), {
      year: "2021"
    })
    .subscribe(data => {
      if (data["status"] == 200) {
        this.rows = data["data"].rows;
        this.loadingIndicator = false;
      }
    });
  }

  onActivate(event) {
    (event.type === 'click') && event.cellElement.blur();
  }

  createReport(row, event) {
    
  }
}
