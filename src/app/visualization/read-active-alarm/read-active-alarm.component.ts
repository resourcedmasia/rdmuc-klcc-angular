import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-read-active-alarm',
  templateUrl: './read-active-alarm.component.html',
  styleUrls: ['./read-active-alarm.component.scss']
})
export class ReadActiveAlarmComponent implements OnInit {
  @Input() row: any;
  @Output() valueChange = new EventEmitter();
  htmlDate: any;
  currentDate: any;
  public screenWidth: any;

  constructor(
    public activeModal: NgbActiveModal,
  ) {
    this.screenWidth = window.innerWidth +'px';
  }

  ngOnInit() {
    
    this.currentDate = new Date();
    var d = this.currentDate;
    var day = d.getDate();
    var month = d.getMonth()+1;
    var year = d.getFullYear();
    this.htmlDate = day+"/"+month+"/"+year;
  }

  closeModal() {
    this.activeModal.close();
  }

  convertDate(dt) {
    let cdt = new Date(dt);
    return cdt.toLocaleString("en-MY");
  }

  styleObject(): Object {
    return {'max-height': '600px','max-width': this.screenWidth}
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('alarm-table').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
        <title>Active Alarm ${this.htmlDate}</title>
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
