import { Component, OnInit } from '@angular/core';
import { MomentModule, FromUnixPipe, DateFormatPipe, SubtractPipe, AddPipe, ParsePipe } from 'angular2-moment';
import { AppService } from '../app.service';

@Component({
  selector: 'app-energy-management',
  templateUrl: './energy-management.component.html',
  styleUrls: ['./energy-management.component.scss']
})
export class EnergyManagementComponent implements OnInit {

	currentDate = new Date();
	
  constructor(private appService: AppService) {
    this.appService.pageTitle = 'Energy Dashboard';
  }

  ngOnInit() {
  }

}
