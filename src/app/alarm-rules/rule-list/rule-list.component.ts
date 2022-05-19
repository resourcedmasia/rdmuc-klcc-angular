import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MomentModule, FromUnixPipe, DateFormatPipe } from 'angular2-moment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AddRuleModalComponent } from '../add-rule-modal/add-rule-modal.component';
import { ModifyRuleModalComponent } from '../modify-rule-modal/modify-rule-modal.component';
import { DeleteRuleModalComponent } from '../delete-rule-modal/delete-rule-modal.component';
import { ActivatedRoute, Params } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'rule-list',
  templateUrl: './rule-list.component.html',
  styleUrls: ['./rule-list.component.scss']
})
export class RuleListComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  private deleteRuleModalRef;
  private addRuleModalRef;
  private modifyRuleModalRef;

  rows = [];
  temp = [];
  loadingIndicator = true;
  filterkey = "";
  
  constructor(private restService: RestService, private authService: AuthService, private modalService: NgbModal, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    setTimeout(() => {  
      this.openAddRuleModalViaAction();
    });

    this.getRules();
  }

  openAddRuleModalViaAction() {
    this.activatedRoute.params.subscribe(params => {
      if (params["action"] == "addRule") {
        let row = JSON.parse(params["row"]);
        this.addRuleModalRef = this.modalService.open(AddRuleModalComponent, {size: 'lg'});
        this.addRuleModalRef.componentInstance.row = row;
        this.addRuleModalRef.componentInstance.valueChange.subscribe(($e) => {
          this.getRules();
        });
      }
    });
  }

  onActivate(event) {
    (event.type === 'click') && event.cellElement.blur();
  }

  getRules() {
    this.loadingIndicator = true;
    // Get Rules
    this.restService.postData("getRules", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {

          this.rows = data["data"].rows;
          this.temp = [...this.rows];
          this.rows.forEach(function(element) {
              if (element.priority == "critical") {
                element.priority_label = "CRITICAL";
              } else if (element.priority == "noncritical") {
                element.priority_label = "NON-CRITICAL";
              } else {
                element.priority_label = "";
              }
          }, this);
          this.loadingIndicator = false;
          // Re-run filters
          this.updateFilter(null);
        }
      });
  }

  deleteRule(id) {
    // Delete rule by ID
    this.restService.postData("deleteRuleByID", this.authService.getToken(), {id: id})
    .subscribe(data => {
      // Successful login
      if (data["status"] == 200) {
        this.getRules();;
      }
    });
  }

  openAddRuleModal() {
    this.addRuleModalRef = this.modalService.open(AddRuleModalComponent, {size: 'lg'});
    this.addRuleModalRef.componentInstance.valueChange.subscribe(($e) => {
      this.getRules();
    });
  }

  // ngx-datatable row manipulation
  deleteRuleRow(row: any, event) {
    event.target.parentElement.parentElement.blur(); // Fix for error on modal open
    this.deleteRuleModalRef = this.modalService.open(DeleteRuleModalComponent);
    this.deleteRuleModalRef.componentInstance.row = row;
    this.deleteRuleModalRef.result.then((result) => {
      if (result == "confirm") {
        this.deleteRule(row.id);
      }
    }).catch((error) => {
      if (error == "confirm") {
        this.deleteRule(row.id);
      };
    });
  }

  modifyRuleRow(row: any, event) {
    event.target.parentElement.parentElement.blur(); // Fix for error on modal open
    this.modifyRuleModalRef = this.modalService.open(ModifyRuleModalComponent);
    this.modifyRuleModalRef.componentInstance.row = row;
    this.modifyRuleModalRef.componentInstance.valueChange.subscribe(($e) => {
      this.getRules();
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
