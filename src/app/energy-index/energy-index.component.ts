import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-energy-index',
  templateUrl: './energy-index.component.html',
  styleUrls: ['./energy-index.component.scss']
})
export class EnergyIndexComponent implements OnInit {

  constructor(private appService: AppService) {
    this.appService.pageTitle = 'Energy Index';
  }

  ngOnInit() {
  }

}
