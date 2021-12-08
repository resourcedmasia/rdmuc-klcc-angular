import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {Router, NavigationEnd,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-verify-user-modal',
  templateUrl: './verify-user-modal.component.html',
  styleUrls: ['./verify-user-modal.component.scss']
})

export class VerifyUserModalComponent implements OnInit {
  @Input() row: any;
  @Output() valueChange = new EventEmitter();

  verifyUserForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    slave_value: new FormControl(''),
    slave_type: new FormControl(''),
    slave_cell_id: new FormControl(''),
    slave_name: new FormControl(''),
    slave: new FormControl(''),
  });

  constructor(
      private restService: RestService, 
      private authService: AuthService, 
      public activeModal: NgbActiveModal,
      private router: Router
    ) { }

  ngOnInit() {
    console.log(this.row)
    this.verifyUserForm.patchValue({
       slave_value: this.row.slave_value,
       slave_type: this.row.slave_type,
       slave_cell_id: this.row.slave_cell_id,
       slave_name: this.row.slave_name,
       slave: this.row.slave
      });
  }

  async verifyUser() {
    //Verify user in Database
     // Attempt to login
     await this.restService.postData("auth", null, {username: this.verifyUserForm.value.username, password: this.verifyUserForm.value.password})
     .toPromise().then(async data => {
       // Successful login
       if (data["status"] == 200) {
        await this.restService.postData("setSlave", this.authService.getToken(), { controller: this.verifyUserForm.value.slave, name: this.verifyUserForm.value.slave_name, value: this.verifyUserForm.value.slave_value })
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
       } else {
         // Display alert
         this.activeModal.close("fail")
       }
     });
  }

}
