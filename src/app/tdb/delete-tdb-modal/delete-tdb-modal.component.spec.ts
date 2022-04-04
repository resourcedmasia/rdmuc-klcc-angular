import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTdbModalComponent } from './delete-tdb-modal.component';

describe('DeleteTdbModalComponent', () => {
  let component: DeleteTdbModalComponent;
  let fixture: ComponentFixture<DeleteTdbModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteTdbModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTdbModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
