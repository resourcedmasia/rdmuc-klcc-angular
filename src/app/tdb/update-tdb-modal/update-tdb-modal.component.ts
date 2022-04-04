import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { RestService } from '../../rest.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-update-tdb-modal',
  templateUrl: './update-tdb-modal.component.html',
  styleUrls: ['./update-tdb-modal.component.scss']
})
export class UpdateTdbModalComponent implements OnInit {
  @Input() data:any;
  @Output() valueChange = new EventEmitter();

  updateTdbForm: FormGroup;
  isIpAddress = false;
  triggerIp = false;
  btnText = "Test Connection";
  ipAddressText: string;


  constructor(
    private formBuilder: FormBuilder,
    private restService: RestService,
    private authService: AuthService,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.updateTdbForm = this.formBuilder.group({
      tdbName: [this.data[0].tdb_name, Validators.required],
      ipAddress: [this.data[0].ip_address, Validators.required]
    });
  }

  testIpConnection() {
    this.triggerIp = true;
    this.restService.postData("checkIpAddress", this.authService.getToken(), {ipAddress: this.updateTdbForm.value.ipAddress})
    .subscribe(data => {
      setTimeout(()=>{                          
        this.isIpAddress = data["data"].rows;
        if (this.isIpAddress === false) {
          this.triggerIp = false;
          this.ipAddressText = "Invalid IP address, Please enter valid IP address";
          this.changeText("Test Connection");
          this.updateTdbForm.reset();
        } else {
          this.ipAddressText = "Valid IP address";
        }
      }, 2000);      
    });
  }

  updateTdb(){
    this.restService.postData("updateDataBuilder", this.authService.getToken(), {id: this.data[0].id, tdbName: this.updateTdbForm.value.tdbName, ipAddress: this.updateTdbForm.value.ipAddress })
    .subscribe(data => {
      if (data["status"] == 200) {
        this.updateTdbForm.reset();
        this.valueChange.emit("getUsersEvent");
      }
    });

  }

  changeText(value:string) {        
    if (this.triggerIp) {
      this.btnText ="Testing ..."
    } else {
      this.btnText = value;
    }
  }

}
