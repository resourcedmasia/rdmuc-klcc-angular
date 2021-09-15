import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MomentModule, FromUnixPipe, DateFormatPipe } from 'angular2-moment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DeleteUserModalComponent } from '../delete-user-modal/delete-user-modal.component';
import { AddUserModalComponent } from '../add-user-modal/add-user-modal.component';
import { ModifyUserModalComponent } from '../modify-user-modal/modify-user-modal.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  private deleteUserModalRef;
  private addUserModalRef;
  private modifyUserModalRef;

	rows = [];
  temp = [];
  filterkey = "";
  loadingIndicator = true;

  constructor(private restService: RestService, private authService: AuthService, private modalService: NgbModal) { }

  ngOnInit() {
    this.getUsers();
  }

  onActivate(event) {
    (event.type === 'click') && event.cellElement.blur();
  }

  getUsers() {
    this.loadingIndicator = true;
    // Get Assets
    this.restService.postData("getUsers", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          this.rows = data["data"].rows;
          this.temp = [...this.rows];
          this.loadingIndicator = false;
        }
      });
  }

  deleteUser(username) {
    // Delete asset by ID
    this.restService.postData("deleteUserByUsername", this.authService.getToken(), {username: username})
    .subscribe(data => {
      // Successful login
      if (data["status"] == 200) {
        this.getUsers();
      }
    });
  }

  openAddUserModal() {
    this.addUserModalRef = this.modalService.open(AddUserModalComponent, {size: 'lg'});
    this.addUserModalRef.componentInstance.valueChange.subscribe(($e) => {
      this.getUsers();
    });
  }

  // ngx-datatable row manipulation
  deleteUserRow(row: any, event) {
    event.target.parentElement.parentElement.blur(); // Fix for error on modal open
    this.deleteUserModalRef = this.modalService.open(DeleteUserModalComponent);
    this.deleteUserModalRef.componentInstance.row = row;
    this.deleteUserModalRef.result.then((result) => {
      if (result == "confirm") {
        this.deleteUser(row.username);
      }
    }).catch((error) => {
      if (error == "confirm") {
        this.deleteUser(row.username);
      };
    });
  }

  modifyUserRow(row: any, event) {
    event.target.parentElement.parentElement.blur(); // Fix for error on modal open
    this.modifyUserModalRef = this.modalService.open(ModifyUserModalComponent);
    this.modifyUserModalRef.componentInstance.row = row;
    this.modifyUserModalRef.componentInstance.valueChange.subscribe(($e) => {
      this.getUsers();
    });
  }

  updateFilter(event) {
    // Set input search key to lowercase
    const val = this.filterkey.toLowerCase();

    // Filter our data
    const temp = this.temp.filter(function(d) {
      let keyfound = false;

      // Iterate through all array keys
      Object.keys(d).forEach(function(key) {
        if (d[key].toString().toLowerCase().indexOf(val) !== -1) {
          // Match found
          keyfound = true;
        }
      });
      
      return keyfound;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
