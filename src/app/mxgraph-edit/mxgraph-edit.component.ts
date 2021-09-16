
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../rest.service';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';


@Component({
  selector: 'app-mxgraph-edit',
  templateUrl: './mxgraph-edit.component.html',
  styleUrls: ['./mxgraph-edit.component.scss']
})


export class MxgraphEditComponent implements OnInit {
  @Output() valueChange = new EventEmitter();

  // ng-select
  role_selectOptions = [{ "label": "Administrator", "value": "administrator" }, { "label": "User", "value": "user" }];

  todoitems = any;
  check = [];
  public createUserForm: FormGroup;

  // Form input (defaults)




  constructor(private restService: RestService, private authService: AuthService, public activeModal: NgbActiveModal) { }

  ngOnInit() {


    var storedItems = localStorage.getItem('myData')
    var cell_name = JSON.parse(localStorage.getItem('cell_name'))
    var cell_value = JSON.parse(localStorage.getItem('cell_value'))
    var cell_units = JSON.parse(localStorage.getItem('cell_units'))


    this.createUserForm = new FormGroup({
      username: new FormControl(storedItems, Validators.compose([Validators.required])),
      password: new FormControl(cell_name, Validators.required),
      name: new FormControl(cell_value, Validators.required),
      email: new FormControl(cell_units, Validators.required)
    });


  }

  createUser() {

    this.restService.postData("setSlave", this.authService.getToken(), { controller: this.createUserForm.value.username, name: this.createUserForm.value.password, value: this.createUserForm.value.name })
      .subscribe(data => {
        // Successful login
        if (data["status"] == 200) {
          console.log("succes s upodatye ");
          this.createUserForm.reset();
          // this.valueChange.emit("getUsersEvent");
        }
      });
  }
}
