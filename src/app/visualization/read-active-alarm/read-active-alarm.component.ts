import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-read-active-alarm',
  templateUrl: './read-active-alarm.component.html',
  styleUrls: ['./read-active-alarm.component.scss']
})
export class ReadActiveAlarmComponent implements OnInit {
  @Input() row: any;
  @Output() valueChange = new EventEmitter();
  

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    console.log(this.row)
  }

  closeModal() {
    this.activeModal.close();
  }

  convertDate(dt) {
    let cdt = new Date(dt);
    return cdt.toLocaleString();
  }

}
