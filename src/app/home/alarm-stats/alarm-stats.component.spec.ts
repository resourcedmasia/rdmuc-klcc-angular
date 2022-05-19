import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmStatsComponent } from './alarm-stats.component';

describe('AlarmStatsComponent', () => {
  let component: AlarmStatsComponent;
  let fixture: ComponentFixture<AlarmStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
