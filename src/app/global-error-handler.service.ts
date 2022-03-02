import { ErrorHandler, Injectable} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
 
@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

    constructor(
        private toastr: ToastrService
    ) {}
  
    handleError(error) {        
        this.successToast('error connection, please check your connection');
   }

   successToast(msg) {
    this.toastr.warning(msg,"", {
       tapToDismiss: true,
       disableTimeOut: false,
       timeOut: 7000,
       positionClass: 'toast-top-full-width'
    });
  }
}