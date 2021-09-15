import { Component, Input, HostBinding } from '@angular/core';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { LayoutService } from '../../layout/layout.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-layout-navbar',
  templateUrl: './layout-navbar.component.html',
  styles: [':host { display: block; }']
})
export class LayoutNavbarComponent {
  isExpanded = false;
  isRTL: boolean;

  @Input() sidenavToggle = true;

  public username;

  @HostBinding('class.layout-navbar') private hostClassMain = true;

  constructor(private restService: RestService, private authService: AuthService, private appService: AppService, private layoutService: LayoutService, public modalService: NgbModal, private router: Router) {
    this.isRTL = appService.isRTL;
    this.getUserInfo();
  }

  currentBg() {
    return `bg-${this.appService.layoutNavbarBg}`;
  }

  toggleSidenav() {
    this.layoutService.toggleCollapsed();
  }

  getUserInfo() {
     // Get Assets
    this.restService.postData("authToken", this.authService.getToken())
      .subscribe(data => {
        // Success
        if (data["status"] == 200) {
          this.username = data["data"].username;
        } else {
          // Token failed, redirect to login
          this.router.navigate(["/login"]);
        }
    });
  }
}
