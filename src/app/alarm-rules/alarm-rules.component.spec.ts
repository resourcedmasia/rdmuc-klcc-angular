import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmRulesComponent } from './alarm-rules.component';

describe('AlarmRulesComponent', () => {
  let component: AlarmRulesComponent;
  let fixture: ComponentFixture<AlarmRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
