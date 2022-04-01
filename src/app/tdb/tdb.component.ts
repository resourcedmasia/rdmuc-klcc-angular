import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';
import { RestService } from '../rest.service';
import { AddTdbModalComponent } from './add-tdb-modal/add-tdb-modal.component';

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
  dataBuilder:dataBuilder[]=[];
  isLoading = false;
  displayMessage: string;

  
  ngOnInit() {
    this.getTdb();
  }

  getTdb() {
    this.restService.postData("getDataBuilder", this.authService.getToken())
    .subscribe(data => {
      // Success
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
  }

}
