import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../auth.service";
import { RestService } from "../rest.service";
import 'rxjs/add/operator/map';


interface GraphLog {
  id: string;
  user: string;
  controller: string;
  slave: string;
  action: string;
  previous_value: string;
  change_value: string;
  mxgraph_id: string;
  mxgraph_name: string;
  time_stamp: string;
  date: string;
}

@Component({
  selector: "app-audit-log",
  templateUrl: "./audit-log.component.html",
  styleUrls: ["./audit-log.component.scss"],
})
export class AuditLogComponent implements OnInit {
  currentDate: any;
  htmlDate: any;


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

  graphLogDetail: GraphLog[] = [];
  filterLogDetail: GraphLog[] = [];
  filterArray: GraphLog[];
  isLoading = false;
  displayMessage: string;
  page: number = 1;
  controllerDropdown = [];
  graphDropdown = [];
  actionDropdown = [];
  selectedController: string;
  selectedAction: string;
  selectedGraph: string;
  dateValue: string;
  selectedLog = [];
  isHideDetail = false;
  config;

  ngOnInit() {    
    this.getAllGraphLog();
    this.currentDate = new Date();
    var d = this.currentDate;
    var day = d.getDate();
    var month = d.getMonth()+1;
    var year = d.getFullYear();
    this.htmlDate = day+"/"+month+"/"+year
  }

  getAllGraphLog() {
    this.restService
      .postData("getGraphLog", this.authService.getToken())
      .subscribe((data: any) => {
        if (data["status"] == 200) {
          let sortArr = [];
          sortArr = data["data"].rows.sort(function (a, b) {
            return a.id - b.id || a.user.localeCompare(b.user);
          });

          let controllerArr = [];
          let actionArr = [];
          let graphArr = [];

          this.graphLogDetail = data["data"].rows;
          this.filterLogDetail = data["data"].rows;
          for (const item of data["data"].rows) {
            controllerArr.push(item.controller);
            actionArr.push(item.action);
            graphArr.push(item.mxgraph_name);
          }
          controllerArr = controllerArr.filter(function (e) {
            return e;
          });
          graphArr = graphArr.filter(function (e) {
            return e;
          });
          actionArr = actionArr.filter(function (e) {
            return e;
          });
          this.controllerDropdown = controllerArr.filter(
            (v, i) => controllerArr.indexOf(v) == i
          );
          this.actionDropdown = actionArr.filter(
            (v, i) => actionArr.indexOf(v) == i
          );
          this.graphDropdown = graphArr.filter(
            (v, i) => graphArr.indexOf(v) == i
          );
          if (this.graphLogDetail.length == 0) {
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

  uniq(array) {
    return Array.from(new Set(array));
  }

  onSelectController(event) {
    this.router.navigate(['graph-log'], { queryParams: { page: 1 } });
    this.selectedAction = null;
    this.selectedGraph = null;
    this.selectedDateValue.nativeElement.value = "";
    this.filterLogDetail = this.graphLogDetail.filter(
      (element) => element.controller == event
    );
    if (this.filterLogDetail.length == 0) {
      this.displayMessage = "No Data To Display";
    }
  }

  onSelectGraph(event) {
    this.router.navigate(['graph-log'], { queryParams: { page: 1 } });
    this.selectedController = null;
    this.selectedAction = null;
    this.selectedDateValue.nativeElement.value = "";
    this.filterLogDetail = this.graphLogDetail.filter(
      (element) => element.mxgraph_name == event
    );
    if (this.filterLogDetail.length == 0) {
      this.displayMessage = "No Data To Display";
    }
  }

  onSelectAction(event) {
    this.router.navigate(['graph-log'], { queryParams: { page: 1 } });
    this.selectedController = null;
    this.selectedGraph = null;
    this.selectedDateValue.nativeElement.value = "";
    this.filterLogDetail = this.graphLogDetail.filter(
      (element) => element.action == event
    );    
    if (this.filterLogDetail.length == 0) {
      this.displayMessage = "No Data To Display";
    }    
  }

  selectDateFn(event) {
    this.router.navigate(['graph-log'], { queryParams: { page: 1 } });
    this.selectedController = null;
    this.selectedGraph = null;
    this.selectedAction = null;
    this.filterLogDetail = this.graphLogDetail.filter(
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
    log = this.graphLogDetail.filter(
      (element) => element.id == id
    );
    this.selectedLog = log[0];
  }

  clearFilter() {
    this.getAllGraphLog();
    this.selectedController = null;
    this.selectedAction = null;
    this.selectedGraph = null;
    this.selectedDateValue.nativeElement.value = "";
  }

  pageChange(newPage: number) {
		this.router.navigate(['graph-log'], { queryParams: { page: newPage } });
	}

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('audit-table').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
        <title>Graph Log</title>
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
