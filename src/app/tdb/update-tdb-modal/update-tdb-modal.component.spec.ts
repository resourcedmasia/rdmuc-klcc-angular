import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTdbModalComponent } from './update-tdb-modal.component';

describe('UpdateTdbModalComponent', () => {
  let component: UpdateTdbModalComponent;
  let fixture: ComponentFixture<UpdateTdbModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTdbModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTdbModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
