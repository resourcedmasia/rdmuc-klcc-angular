import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-modal-data-point',
  templateUrl: './modal-data-point.component.html',
  styleUrls: ['./modal-data-point.component.scss']
})
export class ModalDataPointComponent implements OnInit {

  @Input() data: any;


  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    console.log(this.data);
    
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }

}
