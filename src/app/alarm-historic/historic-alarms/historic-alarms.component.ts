import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MomentModule, FromUnixPipe, DateFormatPipe } from 'angular2-moment';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ViewAlarmComponent } from '../../home/view-alarm/view-alarm.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'historic-alarms',
  templateUrl: './historic-alarms.component.html',
  styleUrls: ['./historic-alarms.component.scss']
})
export class HistoricAlarmsComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  private viewAlarmModalRef;
  rows = [];
  temp = [];
  rules = [];
  filterkey = "";
  items = [];

  loadingIndicator = true;
  columnWidths = [
    {column: "id", width: 50},
    {column: "controller", width: 100},
    {column: "timestamp", width: 150}
  ]

  constructor(private restService: RestService, private authService: AuthService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    this.loadingIndicator = true;

    // Get Active Rules
    this.restService.postData("getRules", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          this.rules = data["data"].rows;
          // Get Active Alarms
          this.restService.postData("getAlarms", this.authService.getToken())
            .subscribe(data => {
              // Success
               if (data["status"] == 200) {
                this.rows = data["data"].rows;
                this.temp = [...this.rows];
                this.rows.forEach(function(element) {
                  element.status = '<span class="badge badge-warning">ACTIVE</span>';
                  element.timestamp_converted = new DateFormatPipe().transform(new FromUnixPipe().transform(element.timestamp), 'LLLL');
                  // Match alarm hash to rule hash, set to false if no match found
                  element.rule = this.rules.filter(rule => rule.hash == element.hash);
                  if (element.rule.length == 0) {
                    element.rule = false;
                  }
                  //console.log(element);
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

  updateFilter(event) {
    this.loadingIndicator = true;

    // Convert uppercase to lower searchkeys
    this.items.forEach(function (searchkey) {
      searchkey.value = searchkey.value.toString().toLowerCase();
      searchkey.display = searchkey.display.toString().toLowerCase();
    });

    let searchkeys = this.items;

    // Filter our data
    const temp = this.temp.filter(function(d) {
      // Reset searchkeys
      searchkeys.forEach(function (searchkey) {
        searchkey.found = false;
      });
      // Iterate through all array keys
      Object.keys(d).forEach(function(key) {
        // Iterate through all search keys
        searchkeys.forEach(function (searchkey) {
          if (d[key].toString().toLowerCase().indexOf(searchkey.value) !== -1) {
            // Match found
            searchkey.found = true;
          }
        });
      });
      
      // Check each searchkey one by one, increment counter if searchkey.found is true
      let finalsearch = 0;
      searchkeys.forEach(function (searchkey) {
        if (searchkey.found) {
          finalsearch++;
        }
      });
      // Same amount of searchkey matches as array length, all keys match
      if (finalsearch == searchkeys.length) {
        return true;
      } else {
        return false;
      }
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;

    this.loadingIndicator = false;
  }
}
