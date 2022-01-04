import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetGptimerModalComponent } from './set-gptimer-modal.component';

describe('SetGptimerModalComponent', () => {
  let component: SetGptimerModalComponent;
  let fixture: ComponentFixture<SetGptimerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetGptimerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetGptimerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
