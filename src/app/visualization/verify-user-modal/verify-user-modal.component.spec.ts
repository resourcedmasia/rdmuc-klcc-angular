import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyUserModalComponent } from './verify-user-modal.component';

describe('VerifyUserModalComponent', () => {
  let component: VerifyUserModalComponent;
  let fixture: ComponentFixture<VerifyUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyUserModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
