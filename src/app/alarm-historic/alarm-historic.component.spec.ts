import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmHistoricComponent } from './alarm-historic.component';

describe('AlarmHistoricComponent', () => {
  let component: AlarmHistoricComponent;
  let fixture: ComponentFixture<AlarmHistoricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmHistoricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
