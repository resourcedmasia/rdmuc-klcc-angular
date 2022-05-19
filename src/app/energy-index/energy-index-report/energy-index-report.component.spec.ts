import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyIndexReportComponent } from './energy-index-report.component';

describe('EnergyIndexReportComponent', () => {
  let component: EnergyIndexReportComponent;
  let fixture: ComponentFixture<EnergyIndexReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyIndexReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyIndexReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
