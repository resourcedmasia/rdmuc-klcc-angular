import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-cctv-modal',
  templateUrl: './event-cctv-modal.component.html',
  styleUrls: ['./event-cctv-modal.component.scss']
})
export class EventCctvModalComponent implements OnInit {

  @Input() data: any;

  constructor() { }

  ngOnInit() {
  }

}
