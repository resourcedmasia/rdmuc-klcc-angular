import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-modify-user-modal',
  templateUrl: './modify-user-modal.component.html',
  styleUrls: ['./modify-user-modal.component.scss']
})
export class ModifyUserModalComponent implements OnInit {
  @Input() row: any;
  @Output() valueChange = new EventEmitter();

  // ng-select
  role_selectOptions = [{"label": "Administrator", "value": "administrator"}, {"label": "User", "value": "user"}];

  // Form input (defaults)
  modifyUserForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    role: new FormControl('user', Validators.required),
  });

  constructor(private restService: RestService, private authService: AuthService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
  	this.modifyUserForm.patchValue({
  	  username: this.row.username,
  	  name: this.row.name,
      email: this.row.email,
      role: this.row.role,
  	});
  }

  updateUser() {
    // Update existing rule
    this.restService.postData("updateUserByUsername", this.authService.getToken(), {username: this.modifyUserForm.value.username, password: this.modifyUserForm.value.password, name: this.modifyUserForm.value.name, email: this.modifyUserForm.value.email, role: this.modifyUserForm.value.role})
    .subscribe(data => {
    // Successful login
    if (data["status"] == 200) {
      this.modifyUserForm.reset();
      this.valueChange.emit("getUsersEvent");
    }
   })
  };
}
