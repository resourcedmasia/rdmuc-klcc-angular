import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyDeleteGraphModalComponent } from './verify-delete-graph-modal.component';

describe('VerifyDeleteGraphModalComponent', () => {
  let component: VerifyDeleteGraphModalComponent;
  let fixture: ComponentFixture<VerifyDeleteGraphModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyDeleteGraphModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyDeleteGraphModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
