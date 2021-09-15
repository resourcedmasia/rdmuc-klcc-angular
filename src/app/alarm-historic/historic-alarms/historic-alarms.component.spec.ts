import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricAlarmsComponent } from './historic-alarms.component';

describe('HistoricAlarmsComponent', () => {
  let component: HistoricAlarmsComponent;
  let fixture: ComponentFixture<HistoricAlarmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricAlarmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricAlarmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
