import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, share, shareReplay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService
    ) { }

  // API Endpoint
  // private baseUrl = 'http://10.1.128.128:8080/api/api.php';
  private baseUrl = 'http://wismagenting.uc.rdmsite.com/api/api.php';
  

  
  // Method exports
  postData(method, token = null, data = null) {
    return this.httpClient.post(
      this.baseUrl,
      {
        method: method,
        token: token,
        data: data
      }).pipe(share(),
        catchError( err => {
          if (err.status === 500 ||  err.status === 503 ) {
            this.warningToast('There are error with your connection.Please check your connection');
          }
          return err;
        })
      );
  }

  getConfig() {
    return this.httpClient.get(
      this.baseUrl,
      {
        observe: 'body',
        responseType: 'json'
      }).pipe(shareReplay(1),
        catchError( err => {
          if (err.status === 500 ||  err.status === 503 ) {
            this.warningToast('There are error with your connection.Please check your connection');
          }
          return err;
        })
      );
  }

  warningToast(msg) {    
    this.toastr.warning(msg,"", {
      tapToDismiss: true,
      disableTimeOut: false,
      timeOut: 5000,
      positionClass: 'toast-top-full-width'
    });
  }
}
