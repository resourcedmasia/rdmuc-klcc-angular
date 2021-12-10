import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';



@Component({
  selector: 'app-write-visualization-modal',
  templateUrl: './write-visualization-modal.component.html',
  styleUrls: ['./write-visualization-modal.component.scss']
})
export class WriteVisualizationModalComponent implements OnInit {
  @Input() row: any;
  @Output() valueChange = new EventEmitter();

  writeForm = new FormGroup({
  	slave_value: new FormControl('',Validators.required),
    slave_type: new FormControl(''),
    slave_cell_id: new FormControl(''),
    slave_name: new FormControl(''),
    slave: new FormControl('')
  });

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.writeForm.patchValue({
  	 slave_value: this.row.slave_value,
     slave_type: this.row.slave_type,
     slave_cell_id: this.row.slave_cell_id,
     slave_name: this.row.slave_name,
     slave: this.row.slave
     
  	});
  }

  closeModal() {
	  this.activeModal.close('Modal Closed');
  }

  verifyUser() {
    this.activeModal.close(this.writeForm.value);
  }

}
