import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';
import { RestService } from '../rest.service';

interface AlarmList {
  serial: string;
  controller: string;
  description: string;
  occurred: Date;
  accepted: string;
  acceptedBy: string;
  cleared: string;
  date_cleared: string;
  date_occured: string;
  date_accepted: string;
}

@Component({
  selector: 'app-alarm-history',
  templateUrl: './alarm-history.component.html',
  styleUrls: ['./alarm-history.component.scss']
})

export class AlarmHistoryComponent implements OnInit {

  @ViewChild("selectedDateOccured") selectedDateValue: ElementRef;
  @ViewChild("selectedDateAccept") selectedDateAccept: ElementRef;
  @ViewChild("selectedDateCleared") selectedDateCleared: ElementRef;
  @ViewChild("selectedDateCurrentOccured") selectedDateCurrent: ElementRef;


  alarmDetail: AlarmList[] = [];
  currentAlarmDetail: AlarmList[] = [];
  alarmHistoryCurrent: AlarmList[] = [];
  alarmHistoryDetail: AlarmList[] = [];
  filterArray: any[];
  isLoading = false;
  displayMessage: string;
  page: number = 1;
  controllerDropdown = [];
  acceptedByDropdown = [];
  selectedController: string;
  selectedAcceptedBy: string;
  selectedGraph: string;
  selectedLog = [];
  isHideDetail = false;
  config;
  currentDate: any;
  htmlDate: any;

  controllerCurrentDropdown = [];
  acceptedByCurrentDropdown = [];
  selectedCurrentController: string;


  constructor(
    private restService: RestService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.spinner.show();
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
    this.route.queryParamMap.map(params => params.get('page')).subscribe(page => this.config.currentPage = page);
   }

  ngOnInit() {
    this.getAlarmHistory();
    this.currentDate = new Date();
    let d = this.currentDate;
    let day = d.getDate();
    let month = d.getMonth()+1;
    let year = d.getFullYear();
    this.htmlDate = day+"/"+month+"/"+year;
  }

  getAlarmHistory() {
    this.restService
      .postData("getAllAlarmSoap", this.authService.getToken())
      .subscribe((data: any) => {
        if (data["status"] == 200) {

          let sortArr = [];
          sortArr = data["data"].rows.sort(function (a, b) {
            return a.serial - b.serial || a.user.localeCompare(b.user);
          });

          let controllerArr = [];
          let acceptedByArr = [];

          this.alarmDetail = sortArr;          
          this.alarmHistoryDetail = data["data"].rows;
          for (const item of data["data"].rows) {
            controllerArr.push(item.controller);
            acceptedByArr.push(item.acceptedBy);
          }
          controllerArr = controllerArr.filter(function (e) {
            return e;
          });
          acceptedByArr = acceptedByArr.filter(function (e) {
            return e;
          });
          this.controllerDropdown = controllerArr.filter(
            (v, i) => controllerArr.indexOf(v) == i
          );
          this.acceptedByDropdown = acceptedByArr.filter(
            (v, i) => acceptedByArr.indexOf(v) == i
          );
          if (this.alarmDetail.length == 0) {
            this.displayMessage = "No Data To Display";
          }

          let currentArr = data["data"].rows.filter(item => item.accepted === null && item.cleared === null)

          let sortCurrentArr = [];
          sortCurrentArr = currentArr.sort(function (a, b) {
            return a.serial - b.serial || a.user.localeCompare(b.user);
          });

          let controllerCurrentArr = [];

          this.currentAlarmDetail = sortCurrentArr;     
               
          this.alarmHistoryCurrent = currentArr;
          for (const item of currentArr) {
            controllerCurrentArr.push(item.controller);
          }
          controllerCurrentArr = controllerCurrentArr.filter(function (e) {
            return e;
          });
          this.controllerCurrentDropdown = controllerCurrentArr.filter(
            (v, i) => controllerCurrentArr.indexOf(v) == i
          );
          if (this.currentAlarmDetail.length == 0) {
            this.displayMessage = "No Data To Display";
          }

          this.isLoading = true;
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        } else {
          this.spinner.hide();
          this.displayMessage = "No Data To Display";
        }
      });
  }

  onSelectController(event) {
    this.router.navigate(['alarm-history'], { queryParams: { page: 1 } });
    this.selectedAcceptedBy = null;
    this.selectedDateValue.nativeElement.value = "";
    this.selectedDateCleared.nativeElement.value = "";
    this.selectedDateAccept.nativeElement.value = "";
    this.alarmHistoryDetail = this.alarmDetail.filter(
      (element) => element.controller == event
    );
    if (this.alarmHistoryDetail.length == 0) {
      this.displayMessage = "No Data To Display";
    }
  }

  onSelectAcceptedBy(event) {
    this.router.navigate(['alarm-history'], { queryParams: { page: 1 } });
    this.selectedController = null;
    this.selectedDateValue.nativeElement.value = "";
    this.selectedDateCleared.nativeElement.value = "";
    this.selectedDateAccept.nativeElement.value = "";
    this.alarmHistoryDetail = this.alarmDetail.filter(
      (element) => element.acceptedBy == event
    );    
    if (this.alarmHistoryDetail.length == 0) {
      this.displayMessage = "No Data To Display";
    }    
  }

  selectOccuredFn(event) {    
    this.router.navigate(['alarm-history'], { queryParams: { page: 1 } });
    this.selectedController = null;
    this.selectedAcceptedBy = null;
    this.alarmHistoryDetail = this.alarmDetail.filter(
      (element) => 
      element.date_occured == event.target.value
    );
    if (this.alarmHistoryDetail.length == 0) {
      this.displayMessage = "No Data To Display";
    }
  }

  selectAcceptFn(event) {    
    this.router.navigate(['alarm-history'], { queryParams: { page: 1 } });
    this.selectedController = null;
    this.selectedAcceptedBy = null;
    this.alarmHistoryDetail = this.alarmDetail.filter(
      (element) => 
      element.date_accepted == event.target.value
    );
    if (this.alarmHistoryDetail.length == 0) {
      this.displayMessage = "No Data To Display";
    }
  }

  selectClearedFn(event) {    
    this.router.navigate(['alarm-history'], { queryParams: { page: 1 } });
    this.selectedController = null;
    this.selectedAcceptedBy = null;
    this.alarmHistoryDetail = this.alarmDetail.filter(
      (element) => 
      element.date_cleared == event.target.value
    );    
    if (this.alarmHistoryDetail.length == 0) {
      this.displayMessage = "No Data To Display";
    }
  }

  selectCurrentOccuredFn(event) {    
    this.selectedCurrentController = null;
    this.alarmHistoryCurrent = this.currentAlarmDetail.filter(
      (element) => 
      element.date_occured == event.target.value
    );
    if (this.alarmHistoryCurrent.length == 0) {
      this.displayMessage = "No Data To Display";
    }
  }

  clearFilter() {
    this.getAlarmHistory();
    this.selectedController = null;
    this.selectedAcceptedBy = null;
    this.selectedDateValue.nativeElement.value = "";
    this.selectedDateCleared.nativeElement.value = "";
    this.selectedDateAccept.nativeElement.value = "";
  }

  clearCurrentFilter() {
    this.getAlarmHistory();
    this.selectedCurrentController = null;
    this.selectedDateCurrent.nativeElement.value = '';
  }

  pageChange(newPage: number) {
		this.router.navigate(['alarm-history'], { queryParams: { page: newPage } });
	}

  onSelectCurrentController(event) {
    this.alarmHistoryCurrent = this.currentAlarmDetail.filter(
      (element) => element.controller == event
    );    
    if (this.alarmHistoryCurrent.length == 0) {
      this.displayMessage = "No Data To Display";
    }
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('alarm-history-table').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
        <title>Old Alarm</title>
        <style type="text/css">
          table th, table td { 
          border-style: groove;
        }
        </style>
      </head>
      <body onload="window.print();window.close()">${printContents}</body>
    </html>`
    );
    popupWin.document.close();
  }

  printCurrent(): void {
    let printContents, popupWin;
    printContents = document.getElementById('alarm-history-current-table').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
        <title>Current Alarm</title>
        <style type="text/css">
          table th, table td { 
          border-style: groove;
        }
        </style>
      </head>
      <body onload="window.print();window.close()">${printContents}</body>
    </html>`
    );
    popupWin.document.close();
  }
}
