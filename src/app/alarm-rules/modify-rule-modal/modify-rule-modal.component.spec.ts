import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyRuleModalComponent } from './modify-rule-modal.component';

describe('ModifyRuleModalComponent', () => {
  let component: ModifyRuleModalComponent;
  let fixture: ComponentFixture<ModifyRuleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyRuleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyRuleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
