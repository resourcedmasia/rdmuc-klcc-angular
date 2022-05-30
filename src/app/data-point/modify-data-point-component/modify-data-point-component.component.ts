import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modify-data-point-component',
  templateUrl: './modify-data-point-component.component.html',
  styleUrls: ['./modify-data-point-component.component.scss']
})
export class ModifyDataPointComponentComponent implements OnInit {

  @Input() data: any;


  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    console.log(this.data);
  }

}


