import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth.service';
import { RestService } from '../../rest.service';
import { DeleteModalDataPointComponent } from '../delete-modal-data-point/delete-modal-data-point.component';

@Component({
  selector: 'app-list-data-point',
  templateUrl: './list-data-point.component.html',
  styleUrls: ['./list-data-point.component.scss']
})
export class ListDataPointComponent implements OnInit {

 dataPoint: any;
 dataSheet: any;
 isLoadTab = false;

  constructor(
    private restService: RestService, 
    private authService: AuthService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.getDataPoint();
  }

  getDataPoint() {
    this.restService.postData("getDataPoint", this.authService.getToken())
    .subscribe(data => {
      if (data["status"] == 200) {        
        this.dataPoint = data["data"].rows;        
      }
    });
  }

  detail(detailData:any) {    
    this.dataSheet = JSON.parse(detailData);    
    this.isLoadTab = true;
  }

  redirectBackUrl() {
    this.isLoadTab = !this.isLoadTab;
  }

  deleteData(id) {    
    const selectedData = this.dataPoint.filter((el => el.id == id ));    
    let modalRef = this.modalService.open(DeleteModalDataPointComponent);  
    modalRef.componentInstance.data = selectedData;
    modalRef.result.then((result) => {
      if (result == "confirm") {
        this.deleteDataPoint(id);
      }
    }).catch((error) => {
      if (error == "confirm") {
        this.deleteDataPoint(id);
      };
    });
  }

  deleteDataPoint(id:number) {
    this.restService.postData("deleteDataPoint", this.authService.getToken(), {id: id})
    .subscribe(data => {
      if (data["status"] == 200) {
        this.getDataPoint();
      }
    });
  }

}
