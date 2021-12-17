import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {Router, NavigationEnd,ActivatedRoute} from '@angular/router';




@Component({
  selector: 'app-write-visualization-modal',
  templateUrl: './write-visualization-modal.component.html',
  styleUrls: ['./write-visualization-modal.component.scss']
})
export class WriteVisualizationModalComponent implements OnInit {
  @Input() row: any;
  @Output() valueChange = new EventEmitter();

  dropDownArray: any [];
  selected: any;

  writeForm = new FormGroup({
  	slave_value: new FormControl('',Validators.required),
    slave_type: new FormControl(''),
    slave_cell_id: new FormControl(''),
    slave_name: new FormControl(''),
    slave: new FormControl('')
  });

  constructor(public activeModal: NgbActiveModal, 
              private restService: RestService,
              private router: Router,
              private authService: AuthService, 
             ) { }

  ngOnInit() {
    this.writeForm.patchValue({
  	 slave_value: this.row.slave_value,
     slave_type: this.row.slave_type,
     slave_cell_id: this.row.slave_cell_id,
     slave_name: this.row.slave_name,
     slave: this.row.slave
  	});

    if(this.row.slave_detail.Type.length > 0) {
      if(this.row.slave_detail.Type == "String") {
        this.dropDownArray = this.row.slave_detail.Strings.String;
      }
    }

  }

  closeModal() {
	  this.activeModal.close('Modal Closed');
  }

  async verifyUser() {
        await this.restService.postData("setSlave", this.authService.getToken(), { controller: this.writeForm.value.slave, name: this.writeForm.value.slave_name, value: this.writeForm.value.slave_value })
        .toPromise().then(data => {
        // Successful login
        if (data["status"] == 200 && data["data"]["rows"] !== false) {
          this.activeModal.close("success")
          this.router.navigate([this.router.url]);
        }
        else {
          this.activeModal.close("fail")
        }
      });
     
  }

  onInputChange(event) {
    let value = event.target.value;
    this.row.slave_value = value;
    this.writeForm.patchValue({
      slave_value: value,
     });
  }

}
