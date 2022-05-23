import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDataPointComponent } from './modal-data-point.component';

describe('ModalDataPointComponent', () => {
  let component: ModalDataPointComponent;
  let fixture: ComponentFixture<ModalDataPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDataPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDataPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
