import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRuleModalComponent } from './delete-rule-modal.component';

describe('DeleteRuleModalComponent', () => {
  let component: DeleteRuleModalComponent;
  let fixture: ComponentFixture<DeleteRuleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteRuleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRuleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
