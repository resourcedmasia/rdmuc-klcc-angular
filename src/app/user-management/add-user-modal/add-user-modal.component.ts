import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss'
  ]
})
export class AddUserModalComponent implements OnInit {
  @Output() valueChange = new EventEmitter();

  // ng-select
  role_selectOptions = [{"label": "Administrator", "value": "administrator"}, {"label": "User", "value": "user"}];

  // Form input (defaults)
  createUserForm = new FormGroup({
    username: new FormControl('', Validators.compose([Validators.required]), this.checkUserExists.bind(this)),
    password: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    role: new FormControl('user', Validators.required),
  });

  constructor(private restService: RestService, private authService: AuthService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  createUser() {
    // Add new user
    this.restService.postData("createUser", this.authService.getToken(), {username: this.createUserForm.value.username, password: this.createUserForm.value.password, name: this.createUserForm.value.name, email: this.createUserForm.value.email, role: this.createUserForm.value.role})
    .subscribe(data => {
      // Successful login
      if (data["status"] == 200) {
        this.createUserForm.reset();
        this.valueChange.emit("getUsersEvent");
      }
    });
  }

  checkUserExists(formControl: FormControl) {
    return new Promise(resolve => {
      // Check if user exists
      this.restService.postData("checkUserExists", this.authService.getToken(), {username: formControl.value})
      .subscribe(data => {
        // Successful login
        if (data["status"] == 200) {
          if(data["data"]["msg"]) {
            resolve({ checkUserExists: true });
          } else {
            resolve(null);
          }
        }
      });
    });
    
  }
}
