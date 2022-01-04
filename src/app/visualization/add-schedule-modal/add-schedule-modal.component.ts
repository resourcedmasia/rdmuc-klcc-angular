import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-schedule-modal',
  templateUrl: './add-schedule-modal.component.html',
  styleUrls: ['./add-schedule-modal.component.scss']
})
export class AddScheduleModalComponent implements OnInit {
  @Input() row: any;
  @Input() gpEvents: any;
  @Output() valueChange = new EventEmitter();

  gptimerForm = new FormGroup({
    Event: new FormControl(''),
  });

  constructor(
    private restService: RestService, 
    private authService: AuthService, 
    public activeModal: NgbActiveModal,
    private router: Router,
    private calendar: NgbCalendar,
    private parserFormatter: NgbDateParserFormatter,
  ) { }

  ngOnInit() {
    console.log(this.row)
    console.log(this.gpEvents)
  }

  closeModal() {
    this.activeModal.close("dismiss");
  }

}
