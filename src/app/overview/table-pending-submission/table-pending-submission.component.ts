import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'table-pending-submission',
  templateUrl: './table-pending-submission.component.html',
  styleUrls: ['./table-pending-submission.component.scss']
})
export class TablePendingSubmissionComponent implements OnInit {

  year = '2021';
  loadingIndicator = true;
  rows = [];

  constructor(private appService: AppService, private restService: RestService, private authService: AuthService, private router: Router) {
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
    let row2 = {
      facility: row.facility,
      facilityId: row.facilityId,
      selectedMonth: row.selectedMonth
    };
    this.router.navigate(['/dataentry/facility', {action: "createReport", row : JSON.stringify(row2)}]);
  }
}
