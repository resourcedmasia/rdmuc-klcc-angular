import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-layout-2',
  templateUrl: './layout-2.component.html',
  styles: [':host { display: block; }', ':host /deep/ .layout-loading .sidenav-link { transition: none !important; }']
})
export class Layout2Component implements AfterViewInit, OnDestroy {
  // Prevent "blink" effect
  public initialized = false;
  public screenWidth: any;
  public screenHeight: any;

  constructor(private layoutService: LayoutService) {
    this.screenWidth = window.innerWidth +'px';
    this.screenHeight = window.innerHeight + 'px';
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initialized = true;

      this.layoutService.init();
      this.layoutService.update();
      this.layoutService.setAutoUpdate(true);
    });
  }

  ngOnDestroy() {
    setTimeout(() => {
      this.layoutService.destroy();
    });
  }

  styleObject(): Object {
    return {'max-height': this.screenHeight,'max-width': this.screenWidth}
  }

  closeSidenav() {
    setTimeout(() => {
      this.layoutService.setCollapsed(true);
    });
  }
}
