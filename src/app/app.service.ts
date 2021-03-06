import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class AppService {
  constructor(private titleService: Title) {}

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
      siteName: "Facility Data Collection System",
      dmURL: "http://www.rdmuc.com/", // RDM Data Manager URL
  
      // Module config
      moduleWorkOrder: false, // Work Order module
      moduleEOD: false, // EOD Report module
      moduleAlarm: false, // Alarm Management module
      moduleAsset: false, // Asset Management module
      moduleEnergy: false, // Energy Management module
      moduleAccessDM: false, // Access DM module
      moduleVisualization: false, // mxGraph / visualization module
      moduleDataEntry: true // Human data entry module
  
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