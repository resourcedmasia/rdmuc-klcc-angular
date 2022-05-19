import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-asset-modal',
  templateUrl: './delete-asset-modal.component.html',
  styleUrls: ['./delete-asset-modal.component.scss']
})
export class DeleteAssetModalComponent implements OnInit {
  @Input() row: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeModal() {
	  this.activeModal.close('Modal Closed');
  }

}
