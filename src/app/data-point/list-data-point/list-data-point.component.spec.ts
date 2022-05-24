import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDataPointComponent } from './list-data-point.component';

describe('ListDataPointComponent', () => {
  let component: ListDataPointComponent;
  let fixture: ComponentFixture<ListDataPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDataPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDataPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
