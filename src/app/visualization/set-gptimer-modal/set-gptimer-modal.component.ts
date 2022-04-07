import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal, NgbDateStruct, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AddScheduleModalComponent } from '../add-schedule-modal/add-schedule-modal.component'; 
import { AppService } from '../../app.service';

const now = new Date();


@Component({
  selector: 'app-set-gptimer-modal',
  templateUrl: './set-gptimer-modal.component.html',
  styleUrls: ['./set-gptimer-modal.component.scss']
})
export class SetGptimerModalComponent implements OnInit {
  @Input() row: any;
  // @Output() valueChange = new EventEmitter();

  GPEvent: any[];
  GPEventModal: any[];
  GPEventIndex: any;
  rowTemp: any;
  GPEventTemp: any[];
  dayOnceTaken: any[];
  dates: any;
  isEventOnce: boolean;
  isRemoveSingle: boolean;
  date: {year: number, month: number};
  model: NgbDateStruct;
  OnTime1: any;
  OnTime2: any;
  OffTime1: any;
  OffTime2: any;
  datePickerDisable: boolean;
  userRole: any;
  allowedRoles: any;
  

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
      private _cdRef: ChangeDetectorRef,
      private appService: AppService
    ) { 
      
    }

  async ngOnInit() {
    console.log("Init")
    await this.init();
  }



  async init() {
    this.OnTime1 = {hour: 0, minute: 0};
    this.OnTime2 = {hour: 0, minute: 0};
    this.OffTime1 = {hour: 0, minute: 0};
    this.OffTime2 = {hour: 0, minute: 0};
    this.GPEvent = [];
    this.GPEventIndex = -1;
    this.GPEventTemp = [];
    this.isRemoveSingle = false;
    this.datePickerDisable = true;
    var status;
    var runOn;
    this.userRole = this.authService.getRole();
    this.allowedRoles = (this.appService.config.role2).indexOf(this.userRole);

    this.rowTemp = Object.assign({},this.row);    

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
    
  }

  ngOnDestroy() {

  }



  selectToday() {
    this.model = this.calendar.getToday();
    this.clickEvent(this.model) 
  }

  removeAll() {
    this.OnTime1 = {hour: 0, minute: 0};
    this.OnTime2 = {hour: 0, minute: 0};
    this.OffTime1 = {hour: 0, minute: 0};
    this.OffTime2 = {hour: 0, minute: 0};
    this.GPEvent = [];
    this.GPEventIndex = -1;
    this.datePickerDisable = true;
    
    // if(this.row.Details.Events) {
    //   this.row.Details.Events = "";
    // }

  }

  removeSingle() {
    this.removeSingleEvent();
    this.clickEvent(this.model);
  }

  removeSingleEvent() {
    let date = this.model;
    const d = new Date(date.year, date.month - 1, date.day);
    let dWeek = d.getDay();

    for(let i = 0; i < this.GPEvent.length; i++) {
      if(this.GPEvent[i].Type == "Once" && this.GPEvent[i].Day === date.day && this.GPEvent[i].Month === date.month && this.GPEvent[i].Year === date.year) {
        console.log("Once")
        return this.GPEvent.splice(i,1);
      }
      else if (this.GPEvent[i].Type == "Year" && this.GPEvent[i].Day === date.day && this.GPEvent[i].Month === date.month){
        console.log("Year")
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
      this.GPEventIndex = i;
      if(this.GPEvent.length > 0) {
        this.datePickerDisable = false;
      }
      else {
        this.datePickerDisable = true;
      }

      if(this.GPEvent[i].Type == "Once" && this.GPEvent[i].Day === date.day && this.GPEvent[i].Month === date.month && this.GPEvent[i].Year === date.year) {
        console.log("Once")
        this.OnTime1 = this.GPEvent[i].OnTime1;
        this.OnTime2 = this.GPEvent[i].OnTime2;
        this.OffTime1 = this.GPEvent[i].OffTime1;
        this.OffTime2 = this.GPEvent[i].OffTime2;
        this.GPEventModal = this.GPEvent[i];
        return this.calculateHours(this.OnTime1,this.OnTime2,this.OffTime1,this.OffTime2)
      }
      else if (this.GPEvent[i].Type == "Year" && this.GPEvent[i].Day === date.day && this.GPEvent[i].Month === date.month){
        console.log("Year")
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
      else {
        this.GPEventIndex = -1
        this.datePickerDisable = true;
      }
    }
    return this.calculateHours(0,0,0,0)
  }

  addSchedule() {
    const modalRef = this.modalService.open(AddScheduleModalComponent, {  
      backdrop: 'static', 
      size:'lg', 
      centered:true
    });
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
    this.activeModal.close("dismiss");
  }

  doEvent(event) {
    for(let i = 0; i < event.length; i++){

      var gpEvent = {
        Day: event[i].Day,
        DayMask: event[i].DayMask,
        Month: event[i].Month,
        OffTime1: event[i].OffTime1,
        OffTime2: event[i].OffTime2,
        OnTime1: event[i].OnTime1,
        OnTime2: event[i].OnTime2,
        Type: event[i].Type,
        Year: event[i].Year
      }

      this.GPEvent.push(gpEvent);
      
      // Sort the order in GPEvent based on priority
      const order = ['Once','Year','Week','Day'];
      const map = new Map();
      order.forEach((x, i) => map.set(x, i));
      this.GPEvent.sort((x, y) => map.get(x.Type) - map.get(y.Type));
      
      this.clickEvent(this.model) 
      this._cdRef.detectChanges();

    }
  }

  async setChannel() {
    const isTdb = Object.keys(this.row).includes('IpAddress');

    if (isTdb) {
      const ipAdress = this.row.IpAddress.split('/')[2].split(':')[0];
      await this.restService.postData("setTdbGPTimerChannel", this.authService.getToken(), { 
        Index: this.row.Details.Index,
        Type: this.row.Details.Type,
        Name: this.row.Details.Name,
        MasterChannel: this.row.Details.MasterChannel,
        IpAddress: ipAdress,
        GPEvent: this.GPEvent
      })
        .toPromise().then(data => {
        // Successful 
        if (data["status"] == 200 && data["data"]["rows"] !== false) {
          this.activeModal.close("success")
          this.router.navigate([this.router.url]);
        }
        else {
          this.activeModal.close("fail")
        }
      });
    } else {
      await this.restService.postData("setGPTimerChannel", this.authService.getToken(), { 
        Index: this.row.Details.Index,
        Type: this.row.Details.Type,
        Name: this.row.Details.Name,
        OutputType: this.row.Details.OutputType,
        OutputMask: this.row.Details.OutputMask,
        OutputIndex: this.row.Details.OutputIndex,
        InputType: this.row.Details.InputType,
        InputController: this.row.Details.InputController,
        InputIndex: this.row.Details.InputIndex,
        MasterChannel: this.row.Details.MasterChannel,
        Invert: this.row.Details.Invert,
        Overridable: this.row.Details.Overridable,
        GPEvent: this.GPEvent
      })
        .toPromise().then(data => {
        // Successful 
        if (data["status"] == 200 && data["data"]["rows"] !== false) {
          this.activeModal.close("success")
          this.router.navigate([this.router.url]);
        }
        else {
          this.activeModal.close("fail")
        }
      });
    }
}

pickerChange(event,type) {
  let minute = event.minute;
  let hour = Math.floor(event.hour * 60);
  let time = Math.floor(hour+minute);

  if(this.GPEvent.length > 0) {
    this.datePickerDisable = false;
  }
  else {
    this.datePickerDisable = true;
  }


  if(this.GPEventIndex >= 0) {
    if (type=="OnTime1"){
      this.GPEvent[this.GPEventIndex].OnTime1 = time;
    }
    else if(type=="OnTime2") {
      this.GPEvent[this.GPEventIndex].OnTime2 = time;
    }
    else if(type=="OffTime1") {
      this.GPEvent[this.GPEventIndex].OffTime1 = time;
    }
    else if(type=="OffTime2") {
      this.GPEvent[this.GPEventIndex].OffTime2 = time;
    }
  }
 

}

}
