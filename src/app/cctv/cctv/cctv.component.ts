import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventCctvModalComponent } from '../event-cctv-modal/event-cctv-modal.component';

@Component({
  selector: 'app-cctv',
  templateUrl: './cctv.component.html',
  styleUrls: ['./cctv.component.scss']
})
export class CctvComponent implements OnInit {

  events: any[]=
  [
    {
      id: 1,
      name: "cctv-1",
      timestamp: "Aug 02 2017 05:02:24",
      url: '/assets/img/cctv.jpg'
    },
    {
      id: 2,
      name: "cctv-2",
      timestamp: "Jun 10 2018 10:28:14",
      url: '/assets/img/cctv.jpg'
    },
    {
      id: 3,
      name: "cctv-3",
      timestamp: "Jun 11 2018 09:28:14",
      url: '/assets/img/cctv.jpg'
    },
    {
      id: 4,
      name: "cctv-4",
      timestamp: "Jun 12 2018 15:00:14",
      url: '/assets/img/cctv.jpg'
    },
    {
      id: 5,
      name: "cctv-5",
      timestamp: "Jun 13 2018 22:28:14",
      url: '/assets/img/cctv.jpg'
    },
    {
      id: 6,
      name: "cctv-6",
      timestamp: "Jun 14 2018 05:28:14",
      url: '/assets/img/cctv.jpg'
    }
  ]

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }

  view(id:number) {
    const selectedData = this.events.filter((el => el.id == id ));    
    let modalRef = this.modalService.open(EventCctvModalComponent, {size: 'lg', windowClass: 'modal-xl'});  
    modalRef.componentInstance.data = selectedData;
  }

}
