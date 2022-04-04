import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-tdb-modal',
  templateUrl: './delete-tdb-modal.component.html',
  styleUrls: ['./delete-tdb-modal.component.scss']
})
export class DeleteTdbModalComponent implements OnInit {
  @Input() data: any;


  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }

}
