import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../auth.service";
import { RestService } from "../rest.service";
import { SetGptimerModalComponent } from "../visualization/set-gptimer-modal/set-gptimer-modal.component";
import { AppService } from '../app.service';
import { SetGptimerComponent } from "./set-gptimer/set-gptimer.component";

interface GPEvent {
  Type: string;
  DayMask: number;
  Day: number;
  Month: number;
  Year: number;
  OnTime1: number;
  OffTime1: number;
  OnTime2: number;
  OffTime2: number;
}

interface Events {
  GPEvent: GPEvent[];
}

interface Details {
  Index: number;
  Type: string;
  Name: string;
  OutputType: string;
  OutputMask: string;
  OutputIndex: number;
  InputType: string;
  InputController: string;
  InputIndex: number;
  MasterChannel: number;
  Invert: boolean;
  Overridable: boolean;
  Events: Events;
}

interface GPTimerDetail {
  TdbName: string;
  Name: string;
  Index: number;
  Status: boolean;
  Details: Details;
}

@Component({
  selector: "app-gp-timer",
  templateUrl: "./gp-timer.component.html",
  styleUrls: ["./gp-timer.component.scss"],
})
export class GpTimerComponent implements OnInit {
  constructor(
    private restService: RestService,
    private authService: AuthService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public appService: AppService
  ) {
    this.toastr.overlayContainer = undefined;
    this.spinner.show();
  }

  gpTimerChannelsDetail = [];
  filterArray: GPTimerDetail[];
  selectedGptimer;
  isLoading = false;
  searchText: string;
  disabledSearch = false;
  defaultData = [];
  tdbArr: any;
  dmArr: any;
  userRole: any;

  ngOnInit() {
    this.userRole = this.authService.getRole();
    this.getAllGpTimer();
  }

  getAllGpTimer() {
    this.restService
      .postData("getCombineGPTimer", this.authService.getToken())
      .subscribe((data: any) => {
        if (data["status"] == 200) {

          this.filterArray = data["data"].rows;
          
          for (const item of this.filterArray) {                        
            let gpDetail = {};
            gpDetail["channel"] = item.Index;
            gpDetail["description"] = item.Name;
            gpDetail["tdbName"] = item.TdbName;
            if (item.Status === false) {
              gpDetail["status"] = "Off";
            } else {
              gpDetail["status"] = "On";
            }
            gpDetail["type"] = item.Details.Type;
            gpDetail["outputType"] = item.Details.OutputType;
            gpDetail["outputMask"] = item.Details.OutputMask;
            this.gpTimerChannelsDetail.push(gpDetail);
          }
          this.defaultData = [...this.gpTimerChannelsDetail];
          this.isLoading = true;
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        } else {
          this.spinner.hide();
        }
      });
  }

  assignGpTimer(name:string, description:string) {       
    let filterObj = {};
    filterObj['TdbName'] = name;
    filterObj['Name'] = description;

    this.selectedGptimer = this.filterArray.filter(function(item) {    
      for (var key in filterObj) {
        if (item[key] === undefined || item[key] != filterObj[key])
          return false;
      }
      return true;
    });
    
    let selected = JSON.parse(JSON.stringify(this.selectedGptimer[0]));    
    const modalRef = this.modalService.open(SetGptimerComponent);
    modalRef.componentInstance.row = selected;
    modalRef.result
      .then(async (result) => {
        if (result == "success") {
          this.toastr.success("Successfully saved changes.", "", {
            tapToDismiss: true,
            disableTimeOut: false,
            timeOut: 2000,
            positionClass: "toast-bottom-right",
          });
          this.gpTimerChannelsDetail = [];
          this.spinner.show();
          this.getAllGpTimer();
        }
      })
      .catch((err) => {
        if (err !== 0) {
          this.toastr.warning("Error in saving changes.", "", {
            disableTimeOut: false,
            timeOut: 2000,
            positionClass: "toast-bottom-right",
          });
        }
      });
  }

  filter() {
    this.searchText = this.searchText.replace(/\s/g, '');
    if (this.searchText.length > 0) {
      this.gpTimerChannelsDetail = this.defaultData.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1);
    }
  }

  onChanges(value: string): void {         
    if (value.length > 0) {
      this.disabledSearch = true;
    }  else if (value.length == 0) {
      this.disabledSearch = false;
    }   
  }

  clearFilter() {
    this.disabledSearch = false;
    this.searchText = '';
    this.gpTimerChannelsDetail = this.defaultData.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1);  
  }
}
