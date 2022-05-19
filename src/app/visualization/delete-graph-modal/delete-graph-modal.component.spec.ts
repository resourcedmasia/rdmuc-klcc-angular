import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGraphModalComponent } from './delete-graph-modal.component';

describe('DeleteGraphModalComponent', () => {
  let component: DeleteGraphModalComponent;
  let fixture: ComponentFixture<DeleteGraphModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteGraphModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteGraphModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
