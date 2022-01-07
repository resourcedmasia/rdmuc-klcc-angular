import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AddScheduleModalComponent } from '../add-schedule-modal/add-schedule-modal.component'; 

const now = new Date();


@Component({
  selector: 'app-set-gptimer-modal',
  templateUrl: './set-gptimer-modal.component.html',
  styleUrls: ['./set-gptimer-modal.component.scss']
})
export class SetGptimerModalComponent implements OnInit {
  @Input() row: any;
  @Output() valueChange = new EventEmitter();

  GPEvent: any[];
  GPEventModal: any[];
  rowTemp: any;
  GPEventTemp: any[];
  dayOnceTaken: any[];
  dates: any;
  isEventOnce: boolean;
  isRemoveSingle: boolean;
  isRemoveAll: boolean;
  date: {year: number, month: number};
  model: NgbDateStruct;
  OnTime1: any;
  OnTime2: any;
  OffTime1: any;
  OffTime2: any;
  

  gptimerForm = new FormGroup({
    Status: new FormControl(''),
    Type: new FormControl(''),
    Name: new FormControl(''),
    InputType: new FormControl(''),
    OutputType: new FormControl(''),
    OutputMask: new FormControl(''),
    InvertOutput: new FormControl({value:'',disabled:true}),
    RunOn: new FormControl(''),
  });

  constructor(
      private restService: RestService, 
      private authService: AuthService, 
      public activeModal: NgbActiveModal,
      private router: Router,
      private calendar: NgbCalendar,
      private parserFormatter: NgbDateParserFormatter,
      private modalService: NgbModal,
      private _cdRef: ChangeDetectorRef
    ) { 
      
    }

  async ngOnInit() {
    await this.init();
  }

  // async ngAfterViewInit() {
  //   await this.init();
  // }

  async init() {
    this.OnTime1 = {hour: 0, minute: 0};
    this.OnTime2 = {hour: 0, minute: 0};
    this.OffTime1 = {hour: 0, minute: 0};
    this.OffTime2 = {hour: 0, minute: 0};
    console.log(this.row)
    this.GPEvent = [];
    this.GPEventTemp = [];
    this.isRemoveSingle = false;
    this.isRemoveAll = false;
    var status;
    var runOn;

    this.rowTemp = this.row;

    if(this.row.Status == false){
      status = "Off";
    }
    else {
      status = "On";
    }

    if(this.row.Details.Overridable == false){
      runOn = "Not-Allowed";
    }
    else {
      runOn = "Allowed";
    }

    this.gptimerForm.patchValue({
        Status: status,
        Type: this.row.Details.Type,
        Name: this.row.Details.Name,
        InputType: this.row.Details.InputType,
        OutputType: this.row.Details.OutputType,
        OutputMask: this.row.Details.OutputMask,
        InvertOutput: this.row.Details.Invert,
        RunOn: runOn,
      });

    if(this.row.Details.Events) {
      if(this.row.Details.Events.GPEvent.length === undefined || this.row.Details.Events.GPEvent.length === "") {
        this.GPEvent.push(this.row.Details.Events.GPEvent);
        this.GPEventTemp = this.GPEvent;
      }
      else {
        this.GPEvent = this.row.Details.Events.GPEvent;
        this.GPEventTemp = this.GPEvent;
      }
    }
    else {
      this.GPEvent = [];
      this.GPEventTemp = this.GPEvent;
    }

    this.selectToday();
    
    
    console.log(this.GPEvent);
    console.log("TEMP",this.GPEventTemp);
  }

  ngOnDestroy() {

  }



  selectToday() {
    this.model = this.calendar.getToday();
    this.clickEvent(this.model) 
  }

  removeAll() {
    this.isRemoveAll = true;
    this.OnTime1 = {hour: 0, minute: 0};
    this.OnTime2 = {hour: 0, minute: 0};
    this.OffTime1 = {hour: 0, minute: 0};
    this.OffTime2 = {hour: 0, minute: 0};
    this.GPEvent = [];
    
    if(this.row.Details.Events) {
      this.row.Details.Events = "";
    }

  }

  removeSingle() {
    let date = this.model
    const d = new Date(date.year, date.month - 1, date.day);
    let dWeek = d.getDay();

    for(let i = 0; i < this.GPEvent.length; i++) {
      if (this.GPEvent[i].Type == "Year" && this.GPEvent[i].Day === date.day && this.GPEvent[i].Month === date.month){
        console.log("Year")
        return this.GPEvent.splice(i,1);
      }
      else if(this.GPEvent[i].Type == "Once" && this.GPEvent[i].Day === date.day && this.GPEvent[i].Month === date.month && this.GPEvent[i].Year === date.year) {
        console.log("Once")
        return this.GPEvent.splice(i,1);
      }
      else if (this.GPEvent[i].Type == "Week" && this.GPEvent[i].DayMask !== 0){

        if(this.GPEvent[i].DayMask == 1 && dWeek === 0) {
          console.log("Week")
          return this.GPEvent.splice(i,1);
        }
        //Daymask 2 == Monday
        else if (this.GPEvent[i].DayMask == 2 && dWeek === 1) {
          console.log("Week")
          return this.GPEvent.splice(i,1);
        }
        //Daymask 4 == Tuesday
        else if (this.GPEvent[i].DayMask == 4 && dWeek === 2) {
          console.log("Week")
          return this.GPEvent.splice(i,1);
        }
        //Daymask 8 == Wednesday
        else if (this.GPEvent[i].DayMask == 8 && dWeek === 3) {
          console.log("Week")
          return this.GPEvent.splice(i,1);
        }
        //Daymask 16 == Thursday
        else if (this.GPEvent[i].DayMask == 16 && dWeek === 4) {
          console.log("Week")
          return this.GPEvent.splice(i,1);
        }
        //Daymask 32 == Friday
        else if (this.GPEvent[i].DayMask == 32 && dWeek === 5) {
          console.log("Week")
          return this.GPEvent.splice(i,1);
        }
        //Daymask 64 == Saturday
        else if (this.GPEvent[i].DayMask == 64 && dWeek === 6) {
          console.log("Week")
          return this.GPEvent.splice(i,1);
        }
      }
      else if (this.GPEvent[i].Type == "Day" && this.GPEvent[i].DayMask == 0){
        console.log("Day")
        return this.GPEvent.splice(i,1);
      }
    }
  }

  isDisabled(date: NgbDateStruct, current: {month: number}) {
    return date.month !== current.month;
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

  clickEvent(date: NgbDateStruct) {
    this.GPEventModal = [];
    this.model = date;
    let dWeek;
    const d = new Date(date.year, date.month - 1, date.day);
    dWeek = d.getDay();
  

    for(let i = 0; i < this.GPEvent.length; i++) {
      if (this.GPEvent[i].Type == "Year" && this.GPEvent[i].Day === date.day && this.GPEvent[i].Month === date.month){
        console.log("Year")
        this.OnTime1 = this.GPEvent[i].OnTime1;
        this.OnTime2 = this.GPEvent[i].OnTime2;
        this.OffTime1 = this.GPEvent[i].OffTime1;
        this.OffTime2 = this.GPEvent[i].OffTime2;
        this.GPEventModal = this.GPEvent[i];
        return this.calculateHours(this.OnTime1,this.OnTime2,this.OffTime1,this.OffTime2)
      }
      else if(this.GPEvent[i].Type == "Once" && this.GPEvent[i].Day === date.day && this.GPEvent[i].Month === date.month && this.GPEvent[i].Year === date.year) {
        console.log("Once")
        this.OnTime1 = this.GPEvent[i].OnTime1;
        this.OnTime2 = this.GPEvent[i].OnTime2;
        this.OffTime1 = this.GPEvent[i].OffTime1;
        this.OffTime2 = this.GPEvent[i].OffTime2;
        this.GPEventModal = this.GPEvent[i];
        return this.calculateHours(this.OnTime1,this.OnTime2,this.OffTime1,this.OffTime2)
      }
      else if (this.GPEvent[i].Type == "Week" && this.GPEvent[i].DayMask !== 0){

        if(this.GPEvent[i].DayMask == 1 && dWeek === 0) {
          console.log("Week")
          this.OnTime1 = this.GPEvent[i].OnTime1;
          this.OnTime2 = this.GPEvent[i].OnTime2;
          this.OffTime1 = this.GPEvent[i].OffTime1;
          this.OffTime2 = this.GPEvent[i].OffTime2;
          this.GPEventModal = this.GPEvent[i];
          return this.calculateHours(this.OnTime1,this.OnTime2,this.OffTime1,this.OffTime2)
        }
        //Daymask 2 == Monday
        else if (this.GPEvent[i].DayMask == 2 && dWeek === 1) {
          console.log("Week")
          this.OnTime1 = this.GPEvent[i].OnTime1;
          this.OnTime2 = this.GPEvent[i].OnTime2;
          this.OffTime1 = this.GPEvent[i].OffTime1;
          this.OffTime2 = this.GPEvent[i].OffTime2;
          this.GPEventModal = this.GPEvent[i];
          return this.calculateHours(this.OnTime1,this.OnTime2,this.OffTime1,this.OffTime2)
        }
        //Daymask 4 == Tuesday
        else if (this.GPEvent[i].DayMask == 4 && dWeek === 2) {
          console.log("Week")
          this.OnTime1 = this.GPEvent[i].OnTime1;
          this.OnTime2 = this.GPEvent[i].OnTime2;
          this.OffTime1 = this.GPEvent[i].OffTime1;
          this.OffTime2 = this.GPEvent[i].OffTime2;
          this.GPEventModal = this.GPEvent[i];
          return this.calculateHours(this.OnTime1,this.OnTime2,this.OffTime1,this.OffTime2)
        }
        //Daymask 8 == Wednesday
        else if (this.GPEvent[i].DayMask == 8 && dWeek === 3) {
          console.log("Week")
          this.OnTime1 = this.GPEvent[i].OnTime1;
          this.OnTime2 = this.GPEvent[i].OnTime2;
          this.OffTime1 = this.GPEvent[i].OffTime1;
          this.OffTime2 = this.GPEvent[i].OffTime2;
          this.GPEventModal = this.GPEvent[i];
          return this.calculateHours(this.OnTime1,this.OnTime2,this.OffTime1,this.OffTime2)
        }
        //Daymask 16 == Thursday
        else if (this.GPEvent[i].DayMask == 16 && dWeek === 4) {
          console.log("Week")
          this.OnTime1 = this.GPEvent[i].OnTime1;
          this.OnTime2 = this.GPEvent[i].OnTime2;
          this.OffTime1 = this.GPEvent[i].OffTime1;
          this.OffTime2 = this.GPEvent[i].OffTime2;
          this.GPEventModal = this.GPEvent[i];
          return this.calculateHours(this.OnTime1,this.OnTime2,this.OffTime1,this.OffTime2)
        }
        //Daymask 32 == Friday
        else if (this.GPEvent[i].DayMask == 32 && dWeek === 5) {
          console.log("Week")
          this.OnTime1 = this.GPEvent[i].OnTime1;
          this.OnTime2 = this.GPEvent[i].OnTime2;
          this.OffTime1 = this.GPEvent[i].OffTime1;
          this.OffTime2 = this.GPEvent[i].OffTime2;
          this.GPEventModal = this.GPEvent[i];
          return this.calculateHours(this.OnTime1,this.OnTime2,this.OffTime1,this.OffTime2)
        }
        //Daymask 64 == Saturday
        else if (this.GPEvent[i].DayMask == 64 && dWeek === 6) {
          console.log("Week")
          this.OnTime1 = this.GPEvent[i].OnTime1;
          this.OnTime2 = this.GPEvent[i].OnTime2;
          this.OffTime1 = this.GPEvent[i].OffTime1;
          this.OffTime2 = this.GPEvent[i].OffTime2;
          this.GPEventModal = this.GPEvent[i];
          return this.calculateHours(this.OnTime1,this.OnTime2,this.OffTime1,this.OffTime2)
        }
      }
      else if (this.GPEvent[i].Type == "Day" && this.GPEvent[i].DayMask == 0){
        console.log("Day")
        this.OnTime1 = this.GPEvent[i].OnTime1;
        this.OnTime2 = this.GPEvent[i].OnTime2;
        this.OffTime1 = this.GPEvent[i].OffTime1;
        this.OffTime2 = this.GPEvent[i].OffTime2;
        this.GPEventModal = this.GPEvent[i];
        return this.calculateHours(this.OnTime1,this.OnTime2,this.OffTime1,this.OffTime2)
      }
    }
    return this.calculateHours(0,0,0,0)
  }

  addSchedule() {
    const modalRef = this.modalService.open(AddScheduleModalComponent, {backdrop: 'static', size:'lg'});
    let row = this.model
    let GPEvent = this.GPEvent
    modalRef.componentInstance.row = row;
    modalRef.componentInstance.GPEvent = GPEvent;
    modalRef.result.then((result) => {
      console.log(result)
      this.doEvent(result);
    }).catch(err => {
        console.log(err)
      })
  }

  closeModal() {
    this.GPEvent = this.GPEventTemp;
    this.activeModal.close("dismiss");
  }

  doEvent(event) {
    let gpEvent = {
      Day: event.Day,
      DayMask: event.DayMask,
      Month: event.Month,
      OffTime1: event.OffTime1,
      OffTime2: event.OffTime2,
      OnTime1: event.OnTime1,
      OnTime2: event.OnTime2,
      Type: event.Type,
      Year: event.Year
    }
    this.GPEvent.push(gpEvent);
    this._cdRef.detectChanges();
  }

}
