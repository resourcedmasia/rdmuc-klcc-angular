import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth.service';
import { RestService } from '../../rest.service';

@Component({
  selector: 'app-add-tdb-modal',
  templateUrl: './add-tdb-modal.component.html',
  styleUrls: ['./add-tdb-modal.component.scss']
})
export class AddTdbModalComponent implements OnInit {

  @Output() valueChange = new EventEmitter();


  isIpAddress = false;
  triggerIp = false;
  btnText = "Test Connection";
  ipAddressText: string;

  createTdbForm: FormGroup;
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private restService: RestService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.createTdbForm = this.formBuilder.group({
      tdbName: ['', Validators.required],
      ipAddress: ['', Validators.required]
    });
  }

  createTdb() {
        const ipAddress = this.createTdbForm.value.ipAddress.replace(/\s/g, '');
        this.restService.postData("addDataBuilder", this.authService.getToken(), {tdbName: this.createTdbForm.value.tdbName, ipAddress: ipAddress })
        .subscribe(data => {
          if (data["status"] == 200) {
            this.valueChange.emit("getTdbEvent");
            this.createTdbForm.reset();
          }
        });
  }

  testIpConnection() {
    this.triggerIp = true;
    this.restService.postData("checkIpAddress", this.authService.getToken(), {ipAddress: this.createTdbForm.value.ipAddress})
    .subscribe(data => {
      setTimeout(()=>{                          
        this.isIpAddress = data["data"].rows;
        if (this.isIpAddress === false) {
          this.triggerIp = false;
          this.ipAddressText = "Invalid IP address, Please enter valid IP address";
          this.changeText("Test Connection");
          this.createTdbForm.reset();
        } else {
          this.ipAddressText = "Valid IP address";
        }
      }, 2000);      
    });
  }

  onChanges(value: string): void {     
    if (this.triggerIp && value.length > 0) {
      this.isIpAddress = false;
      this.btnText = "Test Connection";
      this.ipAddressText = "Please retry test IP address";
    }     
  }

  changeText(value:string) {        
    if (this.triggerIp) {
      this.btnText ="Testing ..."
    } else {
      this.btnText = value;
    }
  }
}
