import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEmissionReportComponent } from './carbon-emission-report.component';

describe('CarbonEmissionReportComponent', () => {
  let component: CarbonEmissionReportComponent;
  let fixture: ComponentFixture<CarbonEmissionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarbonEmissionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarbonEmissionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
