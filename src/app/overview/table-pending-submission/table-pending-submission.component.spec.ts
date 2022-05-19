import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePendingSubmissionComponent } from './table-pending-submission.component';

describe('TablePendingSubmissionComponent', () => {
  let component: TablePendingSubmissionComponent;
  let fixture: ComponentFixture<TablePendingSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablePendingSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablePendingSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
