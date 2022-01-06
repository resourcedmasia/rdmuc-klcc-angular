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

  weeklyForm = new FormGroup({
    Days: new FormControl(''),
  });

  showMain: boolean;
  showDaily: boolean;
  showWeekly: boolean;
  showYearly: boolean;
  showOnce: boolean;
  radioValue: any;
  nextWeeklyButton: boolean;

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
    this.radioValue = "Daily";
    this.showMain = true;
    this.showDaily = false;
    this.showWeekly = false;
    this.showYearly = false;
    this.showOnce = false;
    this.nextWeeklyButton = false;

    this.gptimerForm.patchValue({
      Event: 'Daily'
    })
  }

  readRadio(event) {
    let value = event.target.value;
    this.radioValue = value;
  }

  readCheck(event) {
    console.log(event)
  }

  closeModal() {
    this.activeModal.close("dismiss");
  }

  next() {
    let value = this.radioValue;
    if(value == "Daily") {
      this.showMain = false;
      this.showDaily = true;
      this.showWeekly = false;
      this.showYearly = false;
      this.showOnce = false;
    }
    else if(value == "Weekly") {
      this.showMain = false;
      this.showDaily = false;
      this.showWeekly = true;
      this.showYearly = false;
      this.showOnce = false;
    }
    else if(value == "Yearly") {
      this.showMain = false;
      this.showDaily = false;
      this.showWeekly = false;
      this.showYearly = true;
      this.showOnce = false;
    }
    else if(value == "Once") {
      this.showMain = false;
      this.showDaily = false;
      this.showWeekly = false;
      this.showYearly = false;
      this.showOnce = true;
    }
   
  }

  

  back() {
    this.showMain = true;
    this.showDaily = false;
  }

  backWeekly() {
    this.showMain = true;
    this.showDaily = false;
    this.showWeekly = false;
    this.showYearly = false;
    this.showOnce = false;
    this.nextWeeklyButton = false;
  }

}
