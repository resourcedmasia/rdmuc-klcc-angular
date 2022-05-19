import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetAlarmCountersComponent } from './widget-alarm-counters.component';

describe('WidgetAlarmCountersComponent', () => {
  let component: WidgetAlarmCountersComponent;
  let fixture: ComponentFixture<WidgetAlarmCountersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetAlarmCountersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetAlarmCountersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
