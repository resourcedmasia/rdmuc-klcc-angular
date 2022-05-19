import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardTourComponent } from './guard-tour.component';

describe('GuardTourComponent', () => {
  let component: GuardTourComponent;
  let fixture: ComponentFixture<GuardTourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardTourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
