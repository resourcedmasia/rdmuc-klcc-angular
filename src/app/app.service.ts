import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './auth.service';


@Injectable()
export class AppService {
  constructor(private titleService: Title, private authService: AuthService) {
    const userRole = this.authService.getRole();
  }

  // Set page title
  set pageTitle(value: string) {
    //this.titleService.setTitle(`${value} - Angular Starter`);
    this.titleService.setTitle(`${value}`);
  }

  // Check for RTL layout
  get isRTL() {
    return document.documentElement.getAttribute('dir') === 'rtl' ||
           document.body.getAttribute('dir') === 'rtl';
  }

  // General configuration
  get config() {
    let config = {
      // Site parameters
      siteName: "Wisma Genting",
      dmURL: "http://172.17.86.111/", // RDM Data Manager URL
  
      // Module config
      moduleWorkOrder: false, // Work Order module
      moduleEOD: false, // EOD Report module
      moduleAlarm: false, // Alarm Management module
      moduleAsset: false, // Asset Management module
      moduleEnergy: false, // Energy Management module
      moduleAccessDM: true, // Access DM module
      //
      moduleVisualization: true, // mxGraph / visualization module
      moduleVisualizationAdmin: true, // mxGraph / visualization module / Admin 
      moduleVisualizationUser: true, // mxGraph / visualization module / User 
      moduleVisualizationView: true, // mxGraph / visualization module / View
      moduleGPTimer: true, // gptimer module
      moduleGuardTour: true, // guard-tour module
      moduleAuditLog: true, // mxGraph / gptimer module
      //
      moduleDataEntry: false, // Human data entry module
  
      role1:['superadmin'],
      role2:['superadmin','administrator'],
      role3:['user'],
  
    }
    return config;
  }

  // Check if IE10
  get isIE10() {
    return typeof document['documentMode'] === 'number' && document['documentMode'] === 10;
  }

  // Layout navbar color
  get layoutNavbarBg() {
    return 'navbar-theme';
  }

  // Layout sidenav color
  get layoutSidenavBg() {
    return 'sidenav-theme';
  }

  // Layout footer color
  get layoutFooterBg() {
    return 'footer-theme';
  }

  // Animate scrollTop
  scrollTop(to: number, duration: number, element = document.scrollingElement || document.documentElement) {
    if (element.scrollTop === to) { return; }
    const start = element.scrollTop;
    const change = to - start;
    const startDate = +new Date();

    // t = current time; b = start value; c = change in value; d = duration
    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) { return c / 2 * t * t + b; }
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    const animateScroll = function() {
      const currentDate = +new Date();
      const currentTime = currentDate - startDate;
      element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration), 10);
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        element.scrollTop = to;
      }
    };

    animateScroll();
  }
}