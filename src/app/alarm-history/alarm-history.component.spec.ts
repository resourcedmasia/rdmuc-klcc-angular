import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmHistoryComponent } from './alarm-history.component';

describe('AlarmHistoryComponent', () => {
  let component: AlarmHistoryComponent;
  let fixture: ComponentFixture<AlarmHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
