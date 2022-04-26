import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpTimerModalComponent } from './gp-timer-modal.component';

describe('GpTimerModalComponent', () => {
  let component: GpTimerModalComponent;
  let fixture: ComponentFixture<GpTimerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpTimerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpTimerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
