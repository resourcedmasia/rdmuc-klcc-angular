import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadActiveAlarmComponent } from './read-active-alarm.component';

describe('ReadActiveAlarmComponent', () => {
  let component: ReadActiveAlarmComponent;
  let fixture: ComponentFixture<ReadActiveAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadActiveAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadActiveAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
