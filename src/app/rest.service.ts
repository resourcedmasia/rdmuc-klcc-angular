import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, share, shareReplay } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { environment } from "../environments/environment";
import { Location, LocationStrategy } from '@angular/common';

@Injectable({
  providedIn: "root",
})


export class RestService {
  private originUrl = window.location.origin;
  private baseUrl;
  private urlText = "../assets/url/ipconfig.txt"
  private urlArr = [];
  

  constructor(private httpClient: HttpClient, 
              private toastr: ToastrService) {
                this.checkOriginUrl();
              }


  checkOriginUrl() {
    // Localhost
    if(this.originUrl.includes("http://172.16.98/")) {
      this.baseUrl = "http://172.16.98.200/api/api.php";
    }
    else {
      this.baseUrl = "http://172.16.98.200/api/api.php";
    }

    // // Wisma Genting Local Network
    // if(this.originUrl.includes("http://10.10.10")) {
    //   this.baseUrl = "http://10.10.10.204/api/api.php";
    // }
    // // RDM Network
    // else if(this.originUrl.includes("http://172.31.1")) {
    //   this.baseUrl = "http://172.17.86.254/api/api.php";
    // }
    // // Proxy
    // else {
    //   this.baseUrl = "http://wismagenting.uc.rdmsite.com/api/api.php";
    // }
  }

  // API Endpoint
  // private baseUrl = this.originUrl+"8080/api/api.php";
  // private baseUrl = environment.apiUrl;

  // Method exports
  postData(method, token = null, data = null) {
    return this.httpClient
      .post(this.baseUrl, {
        method: method,
        token: token,
        data: data,
      })
      .pipe(
        share(),
        catchError((err) => {
          if (err.status === 500 || err.status === 503) {
            this.warningToast(
              "There is an error with your connection. Please check your connection"
            );
          } else if (err.status === 400) {
            this.warningToast(
              "There is an error with your connection. Please check your connection"
            );
          }
          return err;
        })
      );
  }

  getConfig() {
    return this.httpClient
      .get(this.baseUrl, {
        observe: "body",
        responseType: "json",
      })
      .pipe(
        shareReplay(1),
        catchError((err) => {
          if (err.status === 500 || err.status === 503) {
            this.warningToast(
              "There are error with your connection.Please check your connection"
            );
          }
          return err;
        })
      );
  }

  getIpConfig() {
    return this.httpClient
      .get(this.urlText, {responseType: 'text'})
      .subscribe(async data => {
        data = data.replace(/^\s+|\s+$/gm,'')
        this.urlArr = data.split(",");
        this.checkOriginUrl();
      });
  }

  warningToast(msg) {
    this.toastr.warning(msg, "", {
      tapToDismiss: true,
      disableTimeOut: false,
      timeOut: 5000,
      positionClass: "toast-top-full-width",
    });
  }
}
