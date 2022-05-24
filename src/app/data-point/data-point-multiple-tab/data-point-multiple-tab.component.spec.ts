import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPointMultipleTabComponent } from './data-point-multiple-tab.component';

describe('DataPointMultipleTabComponent', () => {
  let component: DataPointMultipleTabComponent;
  let fixture: ComponentFixture<DataPointMultipleTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPointMultipleTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPointMultipleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
