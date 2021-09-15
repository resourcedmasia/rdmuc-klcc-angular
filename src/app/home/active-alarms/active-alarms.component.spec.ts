import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveAlarmsComponent } from './active-alarms.component';

describe('ActiveAlarmsComponent', () => {
  let component: ActiveAlarmsComponent;
  let fixture: ComponentFixture<ActiveAlarmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveAlarmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveAlarmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
