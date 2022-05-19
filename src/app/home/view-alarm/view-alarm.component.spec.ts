import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAlarmComponent } from './view-alarm.component';

describe('ViewAlarmComponent', () => {
  let component: ViewAlarmComponent;
  let fixture: ComponentFixture<ViewAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
