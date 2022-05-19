import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyUserModalComponent } from './modify-user-modal.component';

describe('ModifyUserModalComponent', () => {
  let component: ModifyUserModalComponent;
  let fixture: ComponentFixture<ModifyUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyUserModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
