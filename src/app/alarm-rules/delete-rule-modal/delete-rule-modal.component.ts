import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-rule-modal',
  templateUrl: './delete-rule-modal.component.html',
  styleUrls: ['./delete-rule-modal.component.scss']
})
export class DeleteRuleModalComponent implements OnInit {
  @Input() row: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeModal() {
	  this.activeModal.close('Modal Closed');
  }

}
