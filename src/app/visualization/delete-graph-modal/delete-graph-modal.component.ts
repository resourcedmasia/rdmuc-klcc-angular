import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {Router, NavigationEnd,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-delete-graph-modal',
  templateUrl: './delete-graph-modal.component.html',
  styleUrls: ['./delete-graph-modal.component.scss']
})


export class DeleteGraphModalComponent implements OnInit {
  @Input() row: any;
  @Output() valueChange = new EventEmitter();

  constructor(
    private restService: RestService, 
    private authService: AuthService, 
    public activeModal: NgbActiveModal,
    private router: Router
  ) { }

  ngOnInit() {
    console.log(this.row)
  }

}
