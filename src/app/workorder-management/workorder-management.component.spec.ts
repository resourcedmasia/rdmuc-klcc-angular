import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderManagementComponent } from './workorder-management.component';

describe('WorkorderManagementComponent', () => {
  let component: WorkorderManagementComponent;
  let fixture: ComponentFixture<WorkorderManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
