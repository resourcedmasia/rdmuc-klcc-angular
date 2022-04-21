import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';
import { RestService } from '../rest.service';

interface LoginLog {
  id: string;
  timestamp: string;
  username: string;
  ip_address: string;
  user_agent: string;
  status: string;
  date: string;
}

@Component({
  selector: 'app-login-log',
  templateUrl: './login-log.component.html',
  styleUrls: ['./login-log.component.scss']
})
export class LoginLogComponent implements OnInit {

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

   @ViewChild("selectedDate") selectedDateValue: ElementRef;

   loginLogDetail: LoginLog[] = [];
   filterLogDetail: LoginLog[] = [];
   filterArray: LoginLog[];
   isLoading = false;
   displayMessage: string;
   page: number = 1;
   usernameDropdown = [];
   ipDropdown = [];
   statusDropdown = [];
   selectedUsername: string;
   selectedStatus: string;
   selectedIpAddress: string;
   dateValue: string;
   selectedLog = [];
   isHideDetail = false;
   config;
   currentDate: any;
   htmlDate: any;

  ngOnInit() {
    this.getAllLoginLog();
    this.currentDate = new Date();
    var d = this.currentDate;
    var day = d.getDate();
    var month = d.getMonth()+1;
    var year = d.getFullYear();
    this.htmlDate = day+"/"+month+"/"+year
  }

  getAllLoginLog() {
    this.restService
      .postData("getLoginLog", this.authService.getToken())
      .subscribe((data: any) => {
        if (data["status"] == 200) {

          let usernameArr = [];
          let statusArr = [];
          let ipAddressArr = [];

          this.loginLogDetail = data["data"].rows;
          this.filterLogDetail = data["data"].rows;
          for (const item of data["data"].rows) {
            usernameArr.push(item.username);
            statusArr.push(item.status);
            ipAddressArr.push(item.ip_address);
          }
          usernameArr = usernameArr.filter(function (e) {
            return e;
          });
          ipAddressArr = ipAddressArr.filter(function (e) {
            return e;
          });
          statusArr = statusArr.filter(function (e) {
            return e;
          });
          this.usernameDropdown = usernameArr.filter(
            (v, i) => usernameArr.indexOf(v) == i
          );
          this.statusDropdown = statusArr.filter(
            (v, i) => statusArr.indexOf(v) == i
          );
          this.ipDropdown = ipAddressArr.filter(
            (v, i) => ipAddressArr.indexOf(v) == i
          );
          if (this.loginLogDetail.length == 0) {
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

  onSelectUsername(event) {
    this.router.navigate(['login-log'], { queryParams: { page: 1 } });
    this.selectedStatus = null;
    this.selectedIpAddress = null;
    this.selectedDateValue.nativeElement.value = "";
    this.filterLogDetail = this.loginLogDetail.filter(
      (element) => element.username == event
    );
    if (this.filterLogDetail.length == 0) {
      this.displayMessage = "No Data To Display";
    }
  }

  onSelectIpAddress(event) {
    this.router.navigate(['login-log'], { queryParams: { page: 1 } });
    this.selectedUsername = null;
    this.selectedStatus = null;
    this.selectedDateValue.nativeElement.value = "";
    this.filterLogDetail = this.loginLogDetail.filter(
      (element) => element.ip_address == event
    );
    if (this.filterLogDetail.length == 0) {
      this.displayMessage = "No Data To Display";
    }
  }

  onSelectStatus(event) {
    this.router.navigate(['login-log'], { queryParams: { page: 1 } });
    this.selectedUsername = null;
    this.selectedIpAddress = null;
    this.selectedDateValue.nativeElement.value = "";
    this.filterLogDetail = this.loginLogDetail.filter(
      (element) => element.status == event
    );        
    if (this.filterLogDetail.length == 0) {
      this.displayMessage = "No Data To Display";
    }    
  }

  selectDateFn(event) {
    this.router.navigate(['login-log'], { queryParams: { page: 1 } });
    this.selectedUsername = null;
    this.selectedIpAddress = null;
    this.selectedStatus = null;
    this.filterLogDetail = this.loginLogDetail.filter(
      (element) => element.date == event.target.value
    );
    if (this.filterLogDetail.length == 0) {
      this.displayMessage = "No Data To Display";
    }
  }

  redirectBackUrl() {
    this.isHideDetail = !this.isHideDetail;
  }

  detailLog(id) {
    this.isHideDetail = true;
    let log = [];
    log = this.loginLogDetail.filter(
      (element) => element.id == id
    );
    this.selectedLog = log[0];
  }

  clearFilter() {
    this.getAllLoginLog();
    this.selectedUsername = null;
    this.selectedStatus = null;
    this.selectedIpAddress = null;
    this.selectedDateValue.nativeElement.value = "";
  }

  pageChange(newPage: number) {
		this.router.navigate(['login-log'], { queryParams: { page: newPage } });
	}

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('login-table').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
        <title>Login Log</title>
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
