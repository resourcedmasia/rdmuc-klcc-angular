import { Component, Input, ChangeDetectionStrategy, AfterViewInit, HostBinding, Directive, ViewContainerRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { LayoutService } from '../layout.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../rest.service';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-layout-sidenav',
  templateUrl: './layout-sidenav.component.html',
  styles: [':host { display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class LayoutSidenavComponent implements AfterViewInit {
  @Input() orientation = 'vertical';

  @HostBinding('class.layout-sidenav') private hostClassVertical = false;
  @HostBinding('class.layout-sidenav-horizontal') private hostClassHorizontal = false;
  @HostBinding('class.flex-grow-0') private hostClassFlex = false;


  currentApplicationVersion: any;
  userRole: any;

  constructor(private router: Router, public appService: AppService, private layoutService: LayoutService, public modalService: NgbModal, private restService: RestService, private authService: AuthService) {
    // Set host classes
    this.hostClassVertical = this.orientation !== 'horizontal';
    this.hostClassHorizontal = !this.hostClassVertical;
    this.hostClassFlex = this.hostClassHorizontal;
    this.currentApplicationVersion = environment.appVersion;
    this.userRole = this.authService.getRole();
    
  }

  ngAfterViewInit() {
    // Safari bugfix
    this.layoutService._redrawLayoutSidenav();
  }


  getClasses() {
    let bg = this.appService.layoutSidenavBg;

    if (this.orientation === 'horizontal' && (bg.indexOf(' sidenav-dark') !== -1 || bg.indexOf(' sidenav-light') !== -1)) {
      bg = bg
        .replace(' sidenav-dark', '')
        .replace(' sidenav-light', '')
        .replace('-darker', '')
        .replace('-dark', '');
    }

    return `${this.orientation === 'horizontal' ? 'container-p-x ' : ''} bg-${bg}`;
  }

  isActive(url) {
    return this.router.isActive(url, true);
  }

  isMenuActive(url) {
    return this.router.isActive(url, false);
  }

  isMenuOpen(url) {
    return this.router.isActive(url, false) && this.orientation !== 'horizontal';
  }

  toggleSidenav() {
    this.layoutService.toggleCollapsed();
  }

  accessDM() {
    window.open(this.appService.config.dmURL, '_blank');
  }
}
