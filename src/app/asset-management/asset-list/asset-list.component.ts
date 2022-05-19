import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MomentModule, FromUnixPipe, DateFormatPipe } from 'angular2-moment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DeleteAssetModalComponent } from '../delete-asset-modal/delete-asset-modal.component';
import { AddAssetModalComponent } from '../add-asset-modal/add-asset-modal.component';
import { ModifyAssetModalComponent } from '../modify-asset-modal/modify-asset-modal.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  private deleteAssetModalRef;
  private addAssetModalRef;
  private modifyAssetModalRef;

  rows = [];
  temp = [];
  loadingIndicator = true;
  filterkey = "";

  constructor(private restService: RestService, private authService: AuthService, private modalService: NgbModal) { }

  ngOnInit() {
    this.getAssets();
  }

  onActivate(event) {
    (event.type === 'click') && event.cellElement.blur();
  }

  getAssets() {
    this.loadingIndicator = true;
    // Get Assets
    this.restService.postData("getAssets", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          this.rows = data["data"].rows;
          this.temp = [...this.rows];
          this.rows.forEach(function(element) {
              element.controllers = "";
              element.controllerids.forEach(function(element2) {
                element.controllers += '<div class="btn btn-xs btn-success"><i class="ion ion-md-cube"></i>&nbsp;&nbsp;<b>'+element2.name+'</b></div>&nbsp;';
              }, this);
          }, this);
          this.loadingIndicator = false;
          // Re-run filters
          this.updateFilter(null);
        }
      });
  }

  deleteAsset(id) {
    // Delete asset by ID
    this.restService.postData("deleteAssetByID", this.authService.getToken(), {id: id})
    .subscribe(data => {
      // Successful login
      if (data["status"] == 200) {
        this.getAssets();
      }
    });
  }

  openAddAssetModal() {
    this.addAssetModalRef = this.modalService.open(AddAssetModalComponent, {size: 'lg'});
    this.addAssetModalRef.componentInstance.valueChange.subscribe(($e) => {
      this.getAssets();
    });
  }

  // ngx-datatable row manipulation
  deleteAssetRow(row: any, event) {
    event.target.parentElement.parentElement.blur(); // Fix for error on modal open
    this.deleteAssetModalRef = this.modalService.open(DeleteAssetModalComponent);
    this.deleteAssetModalRef.componentInstance.row = row;
    this.deleteAssetModalRef.result.then((result) => {
      if (result == "confirm") {
        this.deleteAsset(row.id);
      }
    }).catch((error) => {
      if (error == "confirm") {
        this.deleteAsset(row.id);
      };
    });
  }

  modifyAssetRow(row: any, event) {
    event.target.parentElement.parentElement.blur(); // Fix for error on modal open
    this.modifyAssetModalRef = this.modalService.open(ModifyAssetModalComponent);
    this.modifyAssetModalRef.componentInstance.row = row;
    this.modifyAssetModalRef.componentInstance.valueChange.subscribe(($e) => {
      this.getAssets();
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

