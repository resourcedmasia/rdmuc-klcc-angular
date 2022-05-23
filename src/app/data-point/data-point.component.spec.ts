import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPointComponent } from './data-point.component';

describe('DataPointComponent', () => {
  let component: DataPointComponent;
  let fixture: ComponentFixture<DataPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
