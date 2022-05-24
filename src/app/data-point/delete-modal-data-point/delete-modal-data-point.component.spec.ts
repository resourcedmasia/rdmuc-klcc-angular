import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModalDataPointComponent } from './delete-modal-data-point.component';

describe('DeleteModalDataPointComponent', () => {
  let component: DeleteModalDataPointComponent;
  let fixture: ComponentFixture<DeleteModalDataPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteModalDataPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteModalDataPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
