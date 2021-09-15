import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPerformanceReportComponent } from './asset-performance-report.component';

describe('AssetPerformanceReportComponent', () => {
  let component: AssetPerformanceReportComponent;
  let fixture: ComponentFixture<AssetPerformanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPerformanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
