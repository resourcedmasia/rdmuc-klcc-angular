import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-asset-performance',
  templateUrl: './asset-performance.component.html',
  styleUrls: ['./asset-performance.component.scss']
})
export class AssetPerformanceComponent implements OnInit {

  constructor(private appService: AppService) {
    this.appService.pageTitle = 'Asset Performance';
  }

  ngOnInit() {
  }

}
