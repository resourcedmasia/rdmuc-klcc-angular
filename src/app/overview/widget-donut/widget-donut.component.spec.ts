import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDonutComponent } from './widget-donut.component';

describe('WidgetDonutComponent', () => {
  let component: WidgetDonutComponent;
  let fixture: ComponentFixture<WidgetDonutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetDonutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
