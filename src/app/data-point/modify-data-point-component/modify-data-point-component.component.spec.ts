import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyDataPointComponentComponent } from './modify-data-point-component.component';

describe('ModifyDataPointComponentComponent', () => {
  let component: ModifyDataPointComponentComponent;
  let fixture: ComponentFixture<ModifyDataPointComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyDataPointComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyDataPointComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
