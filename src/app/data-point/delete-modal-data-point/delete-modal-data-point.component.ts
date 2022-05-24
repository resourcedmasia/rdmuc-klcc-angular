import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-modal-data-point',
  templateUrl: './delete-modal-data-point.component.html',
  styleUrls: ['./delete-modal-data-point.component.scss']
})
export class DeleteModalDataPointComponent implements OnInit {

  @Input() data: any;


  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
   console.log(this.data);
   
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }

}
