import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTdbModalComponent } from './add-tdb-modal.component';

describe('AddTdbModalComponent', () => {
  let component: AddTdbModalComponent;
  let fixture: ComponentFixture<AddTdbModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTdbModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTdbModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
