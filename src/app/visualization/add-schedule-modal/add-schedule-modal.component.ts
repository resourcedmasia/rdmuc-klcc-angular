import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { DataAnalyticsComponent } from '../../data-analytics/data-analytics.component';
import { DataLoader, DataSource } from '@amcharts/amcharts4/core';

@Component({
  selector: 'app-add-schedule-modal',
  templateUrl: './add-schedule-modal.component.html',
  styleUrls: ['./add-schedule-modal.component.scss']
})
export class AddScheduleModalComponent implements OnInit {
  @Input() row: any;
  @Input() GPEvent: any;
  @Output() valueChange = new EventEmitter();

  gptimerForm = new FormGroup({
    Event: new FormControl(''),
  });

  weeklyForm = new FormGroup({
    Days: new FormControl(''),
  });

  checkForm: FormGroup;
  model: NgbDateStruct;
  modelList: Array<NgbDateStruct> = [];

  showMain: boolean;
  showDaily: boolean;
  showWeekly: boolean;
  showYearly: boolean;
  showOnce: boolean;
  radioValue: any;
  nextWeeklyButton: boolean;
  nextYearlyButton: boolean;
  nextOnceButton: boolean;
  showWeeklyPeriod: boolean;
  OnTime1: any;
  OnTime2: any;
  OffTime1: any;
  OffTime2: any;
  dates: any;
  data: any;
  


  constructor(
    private restService: RestService, 
    private authService: AuthService, 
    public activeModal: NgbActiveModal,
    private router: Router,
    private calendar: NgbCalendar,
    private parserFormatter: NgbDateParserFormatter,
    private fb: FormBuilder,
    private _cdRef: ChangeDetectorRef
  ) { 
    this.checkForm = this.fb.group({
      checkArray: this.fb.array([])
    })
  }

  ngOnInit() {
    console.log(this.row)
    console.log(this.GPEvent)
    this.radioValue = "Daily";
    this.showMain = true;
    this.showDaily = false;
    this.showWeekly = false;
    this.showYearly = false;
    this.showOnce = false;
    this.nextWeeklyButton = false;
    this.showWeeklyPeriod = false;
    this.OnTime1 = {hour: 0, minute: 0};
    this.OnTime2 = {hour: 0, minute: 0};
    this.OffTime1 = {hour: 0, minute: 0};
    this.OffTime2 = {hour: 0, minute: 0};

    this.gptimerForm.patchValue({
      Event: 'Daily'
    })


  }

  onChange(event) {
    if(event.current !== null) {
      var currentMonth = event.current.month;
      var currentYear = event.current.year;
      var nextMonth = event.next.month;
      var nextYear = event.next.year; 
    }

    if(event.current == null || event.current =="") {
      // Skip
    }
    else if(currentMonth !== nextMonth || currentYear !== nextYear) {
      this.modelList = [];
      this.nextYearlyButton = false;
      this.nextOnceButton = false;
    }
    else{
      // Skip
    }
  }


  isSelected = (date: NgbDate) => {
    return this.modelList.indexOf(date) >= 0;
  };
  selectOne(date) {
    if (this.modelList.indexOf(date) >= 0) {
      this.modelList = this.modelList.filter(function (ele) {
        return ele != date;
      });
      if(this.modelList.length < 1) {
        this.nextYearlyButton = false;
        this.nextOnceButton = false;
      }
    } else {
      this.modelList.push(date);
      this.nextYearlyButton = true;
      this.nextOnceButton = true;
    }
  }

  readRadio(event) {
    let value = event.target.value;
    this.radioValue = value;
  }

  readCheck(event) {
    const checkArray: FormArray = this.checkForm.get('checkArray') as FormArray;
    if(event.target.checked) {
      checkArray.push(new FormControl(event.target.value));
      if(this.checkForm.value.checkArray.length > 0) {
        this.nextWeeklyButton = true;
      }
      else {
        this.nextWeeklyButton = false;
      }
    }
    else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == event.target.value) {
          checkArray.removeAt(i);
          if(this.checkForm.value.checkArray.length > 0) {
            this.nextWeeklyButton = true;
          }
          else {
            this.nextWeeklyButton = false;
          }
          return;
        }
        i++;
      });
    }
    console.log(this.checkForm.value)
  }

  closeModal() {
    this.activeModal.close("dismiss");
    this.modelList = [];
  }

  next() {
    let value = this.radioValue;
    if(value == "Daily") {
      this.showMain = false;
      this.showDaily = true;
      this.showWeekly = false;
      this.showYearly = false;
      this.showOnce = false;
      this.showWeeklyPeriod = false;
    }
    else if(value == "Weekly") {
      this.showMain = false;
      this.showDaily = false;
      this.showWeekly = true;
      this.showYearly = false;
      this.showOnce = false;
      this.showWeeklyPeriod = false;
    }
    else if(value == "Yearly") {
      this.showMain = false;
      this.showDaily = false;
      this.showWeekly = false;
      this.showYearly = true;
      this.showOnce = false;
      this.showWeeklyPeriod = false;
    }
    else if(value == "Once") {
      this.showMain = false;
      this.showDaily = false;
      this.showWeekly = false;
      this.showYearly = false;
      this.showOnce = true;
      this.showWeeklyPeriod = false;
    }
   
  }

  nextWeekly() {
    this.showMain = false;
    this.showDaily = false;
    this.showWeekly = false;
    this.showYearly = false;
    this.showOnce = false;
    this.showWeeklyPeriod = true;
    this.OnTime1 = {hour: 0, minute: 0};
    this.OnTime2 = {hour: 0, minute: 0};
    this.OffTime1 = {hour: 0, minute: 0};
    this.OffTime2 = {hour: 0, minute: 0};
  }

  nextYearly() {

  }

  back() {
    this.showMain = true;
    this.showDaily = false;
    this.showWeekly = false;
    this.showYearly = false;
    this.showOnce = false;
    this.nextWeeklyButton = false;
    this.nextYearlyButton = false;
  }

  eventOnce(date: NgbDateStruct) {
    this.dates = date;
    return this.dateHasTask(date);
  }

  eventWeekly(date: NgbDateStruct) {
    this.dates = date;
    return this.dateHasTaskWeek(date);
  }

  eventDaily(date: NgbDateStruct) {
    this.dates = date;
    return this.dateHasTaskDay(date);
  }

  eventYearly(date: NgbDateStruct) {
    this.dates = date;
    return this.dateHasTaskYear(date);
  }


  dateHasTask(date: NgbDateStruct): boolean {
    for (let i = 0; i < this.GPEvent.length; i++) {
      if(this.GPEvent[i].Type == "Once") {
        let day = this.GPEvent[i].Day;
        let month = this.GPEvent[i].Month;
        let year = this.GPEvent[i].Year;
  
        if (day === date.day && month === date.month && year === date.year) {
          return true;  
        }
        else {
          // Skip
        }
      }
      else {
        // Skip
      }
    }
    
  }

  dateHasTaskWeek(date: NgbDateStruct): boolean {
    let d0;
    let d1;
    let d2;
    let d3;
    let d4;
    let d5;
    let d6;
    for (let i = 0; i < this.GPEvent.length; i++) {
      if(this.GPEvent[i].Type=="Week") {
        //Daymask 1 == Sunday
        if(this.GPEvent[i].DayMask == 1) {
          const d = new Date(date.year, date.month - 1, date.day);
          d0 = d.getDay() === 0;
        }
        //Daymask 2 == Monday
        else if (this.GPEvent[i].DayMask == 2) {
          const d = new Date(date.year, date.month - 1, date.day);
          d1 = d.getDay() === 1; 
        }
        //Daymask 4 == Tuesday
        else if (this.GPEvent[i].DayMask == 4) {
          const d = new Date(date.year, date.month - 1, date.day);
          d2 = d.getDay() === 2; 
        }
        //Daymask 8 == Wednesday
        else if (this.GPEvent[i].DayMask == 8) {
          const d = new Date(date.year, date.month - 1, date.day);
          d3 = d.getDay() === 3;
        }
        //Daymask 16 == Thursday
        else if (this.GPEvent[i].DayMask == 16) {
          const d = new Date(date.year, date.month - 1, date.day);
          d4 = d.getDay() === 4;  
        }
        //Daymask 32 == Friday
        else if (this.GPEvent[i].DayMask == 32) {
          const d = new Date(date.year, date.month - 1, date.day);
          d5 = d.getDay() === 5; 
        }
        //Daymask 64 == Saturday
        else if (this.GPEvent[i].DayMask == 64) {
          const d = new Date(date.year, date.month - 1, date.day);
          d6 = d.getDay() === 6;
        }
        else {
          // Skip
        }
      }
    }
    return d0 || d1 || d2 || d3 || d4 || d5 || d6 ;
  }

  
  dateHasTaskDay(date: NgbDateStruct): boolean {
    for (let i = 0; i < this.GPEvent.length; i++) {
      if(this.GPEvent[i].Type=="Day") {
        const d = new Date(date.year, date.month - 1, date.day);
        return d.getDay() === 0 || d.getDay() === 1 || d.getDay() === 2 || d.getDay() === 3 || d.getDay() === 4 || d.getDay() === 5 || d.getDay() === 6;
      }
      else {
        // Skip
      }
    }
  }

  dateHasTaskYear(date: NgbDateStruct): boolean {
    for (let i = 0; i < this.GPEvent.length; i++) {
      if(this.GPEvent[i].Type == "Year") {
        let day: number = this.GPEvent[i].Day;
        let month: number = this.GPEvent[i].Month;
  
        if (day === date.day && month === date.month) {
          return true;  
        }
      }
      else {
        // Skip
      }
    }
  }

  calculateHours(OnTime1, OnTime2, OffTime1, OffTime2) {
    if(OnTime1) {
      let hours = Math.floor(OnTime1 / 60); 
      let minutes = OnTime1 % 60;
      this.OnTime1 = {hour: hours, minute: minutes};

    }
    else {
      this.OnTime1 = {hour: 0, minute: 0};
    }

    if(OnTime2) {
      let hours = Math.floor(OnTime2 / 60); 
      let minutes = OnTime2 % 60;
      this.OnTime2 = {hour: hours, minute: minutes};
    }
    else {
      this.OnTime2 = {hour: 0, minute: 0};
    }

    if(OffTime1) {
      let hours = Math.floor(OffTime1 / 60); 
      let minutes = OffTime1 % 60;
      this.OffTime1 = {hour: hours, minute: minutes};
    }
    else {
      this.OffTime1 = {hour: 0, minute: 0};
    }

    if(OffTime2) {
      let hours = Math.floor(OffTime2 / 60); 
      let minutes = OffTime2 % 60;
      this.OffTime2 = {hour: hours, minute: minutes};
    }
    else {
      this.OffTime2 = {hour: 0, minute: 0};
    }
    

    return this.OnTime1 && this.OnTime2 && this.OffTime1 && this.OffTime2
  }

  calculateRevertHours(OnTime1, OnTime2, OffTime1, OffTime2){
    if(OnTime1) {
      let hours = OnTime1.hour * 60; 
      let minutes = OnTime1.minute;
      this.OnTime1 = hours + minutes;

    }
    else {
      this.OnTime1 = 0;
    }

    if(OnTime2) {
      let hours = OnTime2.hour * 60; 
      let minutes = OnTime2.minute;
      this.OnTime2 = hours + minutes;
    }
    else {
      this.OnTime2 = 0;
    }

    if(OffTime1) {
      let hours = OffTime1.hour * 60; 
      let minutes = OffTime1.minute;
      this.OffTime1 = hours + minutes;
    }
    else {
      this.OffTime1 = 0;
    }

    if(OffTime2) {
      let hours = OffTime2.hour * 60; 
      let minutes = OffTime2.minute;
      this.OffTime2 = hours + minutes;
    }
    else {
      this.OffTime2 = 0;
    }
    return this.OnTime1 && this.OnTime2 && this.OffTime1 && this.OffTime2
  }

  finishWeekly() {
    let dayMask;
    this.calculateRevertHours(this.OnTime1,this.OnTime2,this.OffTime1,this.OffTime2);
    for(let i = 0; i < this.checkForm.value.checkArray.length; i++){
      if(this.checkForm.value.checkArray[i] == 'Sunday') {
        dayMask = 1;
      }
      else if(this.checkForm.value.checkArray[i] == 'Monday') {
        dayMask = 2;
      }
      else if(this.checkForm.value.checkArray[i] == 'Tuesday') {
        dayMask = 4;
      }
      else if(this.checkForm.value.checkArray[i] == 'Wednesday') {
        dayMask = 8;
      }
      else if(this.checkForm.value.checkArray[i] == 'Thursday') {
        dayMask = 16;
      }
      else if(this.checkForm.value.checkArray[i] == 'Friday') {
        dayMask = 32;
      }
      else {
        dayMask = 64;
      }

      // if(this.data) {
      //   let data = {
      //     event: "weekly",
      //     Day: 0,
      //     DayMask: dayMask,
      //     Month: 0,
      //     OffTime1: this.OffTime1,
      //     OffTime2: this.OffTime2,
      //     OnTime1: this.OnTime1,
      //     OnTime2: this.OnTime2,
      //     Type: "Week",
      //     Year: 0
      //   }
      //   this.data.push(data)
      // }
      // else {
      //   this.data = {
      //     event: "weekly",
      //     Day: 0,
      //     DayMask: dayMask,
      //     Month: 0,
      //     OffTime1: this.OffTime1,
      //     OffTime2: this.OffTime2,
      //     OnTime1: this.OnTime1,
      //     OnTime2: this.OnTime2,
      //     Type: "Week",
      //     Year: 0
      //   }
      // }
    }

  console.log(this.data)
     
    
    // this.activeModal.close(this.data);
  }

  finishDaily() {
    this.calculateRevertHours(this.OnTime1,this.OnTime2,this.OffTime1,this.OffTime2);
    this.data = {
      event: "daily",
      Day: 0,
      DayMask: 0,
      Month: 0,
      OffTime1: this.OffTime1,
      OffTime2: this.OffTime2,
      OnTime1: this.OnTime1,
      OnTime2: this.OnTime2,
      Type: "Day",
      Year: 0
    }
    this.activeModal.close(this.data);
  }

  finishYearly() {
    this.data = {
      event: "yearly",
      Day: 12,
      DayMask: 0,
      Month: 1,
      OffTime1: 60,
      OffTime2: 0,
      OnTime1: 0,
      OnTime2: 0,
      Type: "Year",
      Year: 2022
    }
    this.activeModal.close(this.data);
  }

  finishOnce() {
    this.data = {
      event: "once",
      Day: 12,
      DayMask: 0,
      Month: 1,
      OffTime1: 60,
      OffTime2: 0,
      OnTime1: 0,
      OnTime2: 0,
      Type: "Once",
      Year: 2022
    }
    this.activeModal.close(this.data);
  }

  

}
