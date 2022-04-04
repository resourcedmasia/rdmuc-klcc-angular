import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';
import { RestService } from '../rest.service';
import { AddTdbModalComponent } from './add-tdb-modal/add-tdb-modal.component';
import { DeleteTdbModalComponent } from './delete-tdb-modal/delete-tdb-modal.component';
import { UpdateTdbModalComponent } from './update-tdb-modal/update-tdb-modal.component';

interface dataBuilder {
  id: string;
  tdb_name: string;
  ip_address: string;
}

@Component({
  selector: 'app-tdb',
  templateUrl: './tdb.component.html',
  styleUrls: ['./tdb.component.scss']
})
export class TdbComponent implements OnInit {

  constructor(
    private restService: RestService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.spinner.show();
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
    this.route.queryParamMap.map(params => params.get('page')).subscribe(page => this.config.currentPage = page);
  }

  config;
  addTdbModalRef;
  deleteTdbModalRef;
  modifyTdbModalRef;
  dataBuilder:dataBuilder[]=[];
  isLoading = false;
  displayMessage: string;

  
  ngOnInit() {
    this.getTdb();
  }

  getTdb() {
    this.restService.postData("getDataBuilder", this.authService.getToken())
    .subscribe(data => {
      if (data["status"] == 200) {
        this.dataBuilder = data["data"].rows;
        this.isLoading = true;
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      } else {
        this.spinner.hide();
        this.displayMessage = "No Data To Display";
      }
    });
  }

  openAddTdbModal() {
    this.addTdbModalRef = this.modalService.open(AddTdbModalComponent, {size: 'lg'});  
    this.addTdbModalRef.componentInstance.valueChange.subscribe(($e) => {
      this.getTdb();
    });
  }

  deleteData(id) {
    const selectedDb = this.dataBuilder.filter((el => el.id === id));
    this.deleteTdbModalRef = this.modalService.open(DeleteTdbModalComponent);  
    this.deleteTdbModalRef.componentInstance.data = selectedDb;
    this.deleteTdbModalRef.result.then((result) => {
      if (result == "confirm") {
        this.deleteTdb(id);
      }
    }).catch((error) => {
      if (error == "confirm") {
        this.deleteTdb(id);
      };
    });
  }

  deleteTdb(id) {
    this.restService.postData("deleteDataBuilder", this.authService.getToken(), {id: id})
    .subscribe(data => {
      if (data["status"] == 200) {
        this.getTdb();
      }
    });
  }

  modifyData(id) {
    const selectedDb = this.dataBuilder.filter((el => el.id === id));
    this.modifyTdbModalRef = this.modalService.open(UpdateTdbModalComponent);
    this.modifyTdbModalRef.componentInstance.data = selectedDb;
    this.modifyTdbModalRef.componentInstance.valueChange.subscribe(($e) => {
      this.getTdb();
    });

  }

}
