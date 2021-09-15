import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { MomentModule, FromUnixPipe, DateFormatPipe } from 'angular2-moment';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ViewAlarmComponent } from '../view-alarm/view-alarm.component';

@Component({
  selector: 'active-alarms',
  templateUrl: './active-alarms.component.html',
  styleUrls: ['./active-alarms.component.scss']
})

export class ActiveAlarmsComponent implements OnInit {
  private viewAlarmModalRef;

  rows = [];
  rows_critical = [];
  rows_noncritical = [];
  rules = [];

  loadingIndicator = true;
  columnWidths = [
    {column: "id", width: 50},
    {column: "controller", width: 100},
    {column: "timestamp", width: 150}
  ]
  // MomentJS
   
  constructor(private restService: RestService, private authService: AuthService, private router: Router, private modalService: NgbModal) { }

  onActivate(event) {
    (event.type === 'click') && event.cellElement.blur();
  }

  ngOnInit() {
    this.loadingIndicator = true;

    // Get Active Rules
    this.restService.postData("getRules", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          this.rules = data["data"].rows;
          // Get Active Alarms
          this.restService.postData("getActiveAlarms", this.authService.getToken())
            .subscribe(data => {
              // Success
               if (data["status"] == 200) {
                this.rows = data["data"].rows;
                this.rows.forEach(function(element) {
                  element.status = '<span class="badge badge-warning"><b>ACTIVE</b></span>';
                  element.timestamp_converted = new DateFormatPipe().transform(new FromUnixPipe().transform(element.timestamp), 'LLLL');
                  // Match alarm hash to rule hash, set to false if no match found
                  element.rule = this.rules.filter(rule => rule.hash == element.hash);
                  if (element.rule.length == 0) {
                    element.rule = false;
                    // No matching rule, assume non-critical alarm
                    this.rows_noncritical.push(element);
                    this.rows_noncritical = [...this.rows_noncritical];
                  } else {
                    // Rule matched, check rule priority for alarm
                    // Seperate alarms into critical and non critical row arrays
                    if (element.rule[0].priority == "critical") {
                      this.rows_critical.push(element);
                      this.rows_critical = [...this.rows_critical];
                    } else {
                      this.rows_noncritical.push(element);
                      this.rows_noncritical = [...this.rows_noncritical];
                    }
                  }
                }, this);
                this.loadingIndicator = false;
               }
            });          
        }
    });
  }

  addAlarmRule(row) {
    this.router.navigate(['/alarm/rules', {action: "addRule", row : JSON.stringify(row)}]);
  }

  viewAlarmRule(row, event) {
    event.target.parentElement.parentElement.blur();
    this.viewAlarmModalRef = this.modalService.open(ViewAlarmComponent, {size: 'lg'});
    this.viewAlarmModalRef.componentInstance.row = row;
  }
}
