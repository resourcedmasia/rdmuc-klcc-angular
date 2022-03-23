import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { RestService } from '../rest.service';
import { Config } from '../../config/config';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-guard-tour',
  templateUrl: './guard-tour.component.html',
  styleUrls: ['./guard-tour.component.scss']
})
export class GuardTourComponent implements OnInit {

  guardTour: any;
  displayMessage: any;
  isLoading = false;
  dateToday: any;
  startFormattedDate: any;
  endFormattedDate: any;
  queryStartFormattedDate: any;
  queryEndFormattedDate: any;
  newFormattedDate: any;
  htmlStartDate: any;
  htmlEndDate: any;
  htmlDate: any;
  minDate: any;

  constructor(
    private restService: RestService,
    private authService: AuthService,
    private config: Config,
    private spinner: NgxSpinnerService
    
  ) {
   
   }

  ngOnInit() {
    this.dateToday = new Date();
    // var d = this.dateToday.toLocaleDateString('en-MY')
    var d = this.dateToday;
    var day = d.getDate();
    var month = d.getMonth()+1;
    var newMonth;
    if(month < 10) {
      newMonth = "0"+month
    }
    else {
      newMonth = month;
    }
    
    var year = d.getFullYear();
    var minYear = d.getFullYear()-1;
    this.startFormattedDate = year+'-'+newMonth+'-'+day
    this.endFormattedDate = year+'-'+newMonth+'-'+day
    this.queryStartFormattedDate = year+'-'+newMonth+'-'+day
    this.queryEndFormattedDate = year+'-'+newMonth+'-'+day
    this.htmlDate = day+'/'+month+'/'+year;
  
    // this.htmlStartDate = day+'-'+month+'-'+year
    // this.htmlEndDate = day+'-'+month+'-'+year
    this.minDate = new Date(d.getFullYear()-1,d.getMonth(),d.getDate())
    console.log(this.minDate)
    this.getGuardTour();
  }

  async getGuardTour() {
    this.spinner.show();
    await this.restService.postData("getGuardTour", this.authService.getToken(), {
      responseType: "Xml", // Xml/Csv
      controller: "M25-06", // M25-06 - Guard Tour Controller
      step: "60", // Seconds
      start: this.queryStartFormattedDate+"T00:00:00+08:00",
      end: this.queryEndFormattedDate+"T23:59:00+08:00"
    }).toPromise().then(data => {
      if (data["status"] == 200) {
        this.guardTour = data["data"].rows;
        if (this.guardTour.length == 0 || this.guardTour == null) {
          this.displayMessage = "No Data To Display";
        }
        this.isLoading = true;
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
      }
      else {
        this.spinner.hide();
        this.displayMessage = "No Data To Display";
      }
    })
  }


  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('security-table').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
        <title>Guard Tour ${this.htmlDate}</title>
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

startDateChange(event) {
  this.queryEndFormattedDate = null;
  this.endFormattedDate = null;
  var startDate = event.target.value;
  this.queryStartFormattedDate = startDate;

}

endDateChange(event) {

  var endDate = event.target.value;
  this.queryEndFormattedDate = endDate;
  if (this.queryStartFormattedDate && this.queryStartFormattedDate <= this.queryEndFormattedDate) {
    this.getGuardTour();
    this.changeHTMLDate();
  }
  else {
    this.queryEndFormattedDate = null;
    this.endFormattedDate = null;
    this.queryStartFormattedDate = null;
    this.startFormattedDate = null;
  }
}

changeHTMLDate() {
  if(this.queryStartFormattedDate === this.queryEndFormattedDate){
    let startDate = this.queryStartFormattedDate;
    let sd = startDate.split("-");
    let syear = sd[0];
    let smonth = sd[1];
    let sday = sd[2];
    let sfinalDate = sday+"/"+smonth+"/"+syear
    this.htmlDate = sfinalDate;
  }
  else {
    let startDate = this.queryStartFormattedDate;
    let sd = startDate.split("-");
    let syear = sd[0];
    let smonth = sd[1];
    let sday = sd[2];
    let sfinalDate = sday+"/"+smonth+"/"+syear

    let endDate = this.queryEndFormattedDate;
    let ed = endDate.split("-");
    let eyear = ed[0];
    let emonth = ed[1];
    let eday = ed[2];
    let efinalDate = eday+"/"+emonth+"/"+eyear
    
    this.htmlDate = sfinalDate+" - "+efinalDate;
  }
}

}
