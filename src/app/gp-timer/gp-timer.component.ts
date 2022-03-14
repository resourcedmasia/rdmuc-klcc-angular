import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../auth.service";
import { RestService } from "../rest.service";
import { SetGptimerModalComponent } from "../visualization/set-gptimer-modal/set-gptimer-modal.component";

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
    private spinner: NgxSpinnerService
  ) {
    this.toastr.overlayContainer = undefined;
  }

  gpTimerChannelsDetail = [];
  filterArray: GPTimerDetail[];
  selectedGptimer;
  isLoading = false;
  displayMessage: string;

  ngOnInit() {
    this.getAllGpTimer();
  }

  getAllGpTimer() {
    this.restService
      .postData("getAllGPTimerChannel", this.authService.getToken())
      .subscribe((data: any) => {
        if (data["status"] == 200) {
          this.spinner.show();
          this.filterArray = data["data"].rows.filter(
            (item) =>
              item.Details.OutputMask !== "" && item.Details.OutputMask !== null
          );
          for (const item of this.filterArray) {
            let gpDetail = {};
            gpDetail["channel"] = item.Index;
            gpDetail["description"] = item.Name;
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
          if (this.gpTimerChannelsDetail.length == 0) {
            this.displayMessage = "No Data To Display";
          }
          this.isLoading = true;
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      });
  }

  assignGpTimer(channel: number) {
    this.selectedGptimer = this.filterArray.filter(
      (item) => item.Index === channel
    );
    const modalRef = this.modalService.open(SetGptimerModalComponent);
    modalRef.componentInstance.row = this.selectedGptimer[0];
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
}
