import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {Router, NavigationEnd,ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-verify-delete-graph-modal',
  templateUrl: './verify-delete-graph-modal.component.html',
  styleUrls: ['./verify-delete-graph-modal.component.scss']
})
export class VerifyDeleteGraphModalComponent implements OnInit {
  @Input() row: any;
  @Output() valueChange = new EventEmitter();

  verifyUserForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    mxgraph_id: new FormControl(''),
  });

  constructor(
    private restService: RestService, 
    private authService: AuthService, 
    public activeModal: NgbActiveModal,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.verifyUserForm.patchValue({
      mxgraph_id: this.row.mxgraph_id,
     });
  }

  async verifyUser() {
    //Verify user in Database
     // Attempt to login
    //  this.spinner.show();
     await this.restService.postData("auth", null, {username: this.verifyUserForm.value.username, password: this.verifyUserForm.value.password})
     .toPromise().then(async data => {
       // Successful login
       if (data["status"] == 200) {
        await this.restService.postData("mxGraphDelete", this.authService.getToken(), { mxgraph_id: this.verifyUserForm.value.mxgraph_id, mxgraph_name: this.row.mxgraph_name })
        .toPromise().then(async data => {
        // Successful Delete
          if (data["status"] == 200 && data["data"]["rows"] !== false) {
            await this.restService.postData("deleteReadDetails", this.authService.getToken(), { mxgraph_id: this.verifyUserForm.value.mxgraph_id})
          .toPromise().then(async data => {
            if (data["status"] == 200 && data["data"]["rows"] !== false) {
              await this.restService.postData("deleteNavLinkAndTarget", this.authService.getToken(), { mxgraph_id: this.verifyUserForm.value.mxgraph_id})
              .toPromise().then(data => {
                if (data["status"] == 200 && data["data"]["rows"] !== false) {
                  this.activeModal.close("success")
                  // this.spinner.hide();
                }
              });
            }
          });
          }
        else {
          this.activeModal.close("fail")
          // this.spinner.hide();
        }
        });
       } else {
         // Display alert
         this.activeModal.close("fail")
        //  this.spinner.hide();
       }
     });
  }

}
