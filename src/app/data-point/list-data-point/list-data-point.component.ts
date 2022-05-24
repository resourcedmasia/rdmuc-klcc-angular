import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { RestService } from '../../rest.service';

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
    private restService: RestService, private authService: AuthService,
  ) { }

  ngOnInit() {
    this.restService.postData("getDataPoint", this.authService.getToken())
    .subscribe(data => {
      if (data["status"] == 200) {
        console.log(JSON.parse(data["data"].rows[0].file_sheets));
        
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

}
