import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetGptimerComponent } from './set-gptimer.component';

describe('SetGptimerComponent', () => {
  let component: SetGptimerComponent;
  let fixture: ComponentFixture<SetGptimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetGptimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetGptimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
