import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-asset-management',
  templateUrl: './asset-management.component.html',
  styleUrls: ['./asset-management.component.scss']
})
export class AssetManagementComponent implements OnInit {

  constructor(private appService: AppService) {
    this.appService.pageTitle = 'Asset Management';
  }

  ngOnInit() {
  }

}
